import { Server, Socket } from "socket.io";
import {
  ClientReadyPayload,
  ClientSnapshotPayload,
  ClientFinishPayload,
  MatchConfig,
} from "./dto";
import { StateRepository } from "./state.repository";
import { now } from "../utils/time";
import { StatisticsClient } from "../integrations/statistics.client";
import { LeaderboardClient } from "../integrations/leaderboard.client";

export class MatchService {
  private statsClient = new StatisticsClient();
  private leaderboardClient = new LeaderboardClient();

  constructor(
    private readonly stateRepo: StateRepository,
    private io?: Server
  ) {}

  attachIO(io: Server) {
    this.io = io;
  }

  /* ================== INIT ================== */

  async initMatch(config: MatchConfig) {
    await this.stateRepo.saveConfig(config.matchId, config);
    await this.stateRepo.setState(config.matchId, "waiting");
  }

  /* ================== READY ================== */

  async handleClientReady(socket: Socket, payload: ClientReadyPayload) {
    socket.userId = payload.userId;
    socket.matchId = payload.matchId;
    socket.join(payload.matchId);

    await this.stateRepo.addPlayer(payload.matchId, payload.userId);

    const config = await this.stateRepo.getConfig(payload.matchId);
    const players = await this.stateRepo.getPlayers(payload.matchId);

    if (config && players.length === config.players.length) {
      await this.stateRepo.setState(payload.matchId, "playing");

      this.io?.to(payload.matchId).emit("server:start", {
        matchId: payload.matchId,
        startTime: now() + 3000,
      });

      this.io?.to(payload.matchId).emit("server:state", {
        state: "playing",
      });
    }
  }

  /* ================== SNAPSHOT ================== */

  async handleClientSnapshot(socket: Socket, payload: ClientSnapshotPayload) {
    await this.stateRepo.saveSnapshot(
      payload.matchId,
      payload.userId,
      payload.snapshot
    );

    socket.to(payload.matchId).emit("server:snapshot", {
      userId: payload.userId,
      snapshot: payload.snapshot,
    });
  }

  /* ================== FINISH ================== */

  async handleClientFinish(socket: Socket, payload: ClientFinishPayload) {
    /**
     * IMPORTANTE:
     * payload.result viene calculado 100 % desde el frontend
     * GameService NO valida ni recalcula nada
     */
    await this.stateRepo.saveResult(
      payload.matchId,
      payload.userId,
      payload.result
    );

    const config = await this.stateRepo.getConfig(payload.matchId);
    const results = await this.stateRepo.getResults(payload.matchId);

    if (config && Object.keys(results).length === config.players.length) {
      await this.finishMatch(payload.matchId, config, results);
    }
  }

  /* ================== FINISH MATCH ================== */

  private async finishMatch(
    matchId: string,
    config: MatchConfig,
    results: Record<
      string,
      {
        score: number;
        accuracy: number;
        maxCombo: number;
        durationMs: number;
        hits: {
          perfect: number;
          great: number;
          good: number;
          miss: number;
        };
        firebaseUid: string;
        gameMode: string;
        token: string;
      }
    >
  ) {
    await this.stateRepo.setState(matchId, "finished");

    for (const [userId, result] of Object.entries(results)) {
      /* ---------- Leaderboard ---------- */
      await this.leaderboardClient.submitScore({
        matchId,
        userId,
        firebaseUid: result.firebaseUid,
        songId: config.songId,
        gameMode: result.gameMode,
        score: result.score,
        accuracy: result.accuracy,
      });

      /* ---------- Statistics ---------- */
      await this.statsClient.postGameResult(
        {
          songId: config.songId,
          score: result.score,
          accuracy: result.accuracy,
          maxCombo: result.maxCombo,
          durationMs: result.durationMs,
          hits: result.hits,
        },
        result.token,
        matchId
      );
    }

    this.io?.to(matchId).emit("server:state", { state: "finished" });
  }

  /* ================== DISCONNECT ================== */

  handleDisconnect(socket: Socket) {
    if (!socket.matchId || !socket.userId) return;

    this.io?.to(socket.matchId).emit("server:state", {
      state: "player_disconnected",
      userId: socket.userId,
    });
  }

  /* ================== REST ================== */

  async getMatch(matchId: string) {
    const config = await this.stateRepo.getConfig(matchId);
    const state = await this.stateRepo.getState(matchId);

    if (!config || !state) return null;

    return {
      matchId,
      state,
      config,
    };
  }

  async forceEndMatch(matchId: string) {
    await this.stateRepo.setState(matchId, "finished");
  }
}
