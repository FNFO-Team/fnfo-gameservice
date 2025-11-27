// src/game/match.service.ts
import { Socket } from "socket.io";
import { StateRepository } from "./state.repository";
import { ScoringService } from "./scoring.service";
import { SyncService } from "./sync.service";
import { AntiCheatService } from "./anticheat.service";
import { ContentClient } from "../integrations/content.client";

export class MatchService {
  private stateRepo = new StateRepository();
  private scoring = new ScoringService();
  private sync = new SyncService();
  private antiCheat = new AntiCheatService();
  private contentClient = new ContentClient();

  private sockets: Map<string, Socket> = new Map();
  private playerMatch: Map<string, string> = new Map();

  /**
   * Inicializar partida desde REST
   */
  async initMatch(config: any) {
    const { matchId, songId, difficulty } = config;

    const content = await this.contentClient.getSongAndChart(
      songId,
      difficulty
    );

    const startTime = Date.now() + 3000; // 3 segundos para sincronización

    await this.stateRepo.saveMatchState(matchId, {
      ...config,
      songUrl: content.songUrl,
      chartUrl: content.chartUrl,
      startTime,
      scores: {},
    });

    return true;
  }

  /**
   * WS: cliente conectado -> ready
   */
  async handleClientReady(socket: Socket, payload: any) {
    const { matchId, userId } = payload;

    this.sockets.set(socket.id, socket);
    this.playerMatch.set(socket.id, matchId);

    const matchState = await this.stateRepo.getMatchState(matchId);

    socket.emit("server:start", {
      startTime: matchState.startTime,
      songUrl: matchState.songUrl,
      chartUrl: matchState.chartUrl,
    });
  }

  /**
   * WS: cliente envía input
   */
  async handleClientInput(socket: Socket, payload: any) {
    const matchId = this.playerMatch.get(socket.id);
    if (!matchId) return;

    const { userId, noteId, judgment, timestamp, expected } = payload;

    const accuracy = this.scoring.calculateHitAccuracy(timestamp, expected);

    const currentScore = await this.stateRepo.getMatchScores(matchId);
    const updatedScore = this.scoring.updatePlayerStats(
      userId,
      judgment || accuracy,
      currentScore[userId] || 0
    );

    await this.stateRepo.updatePlayerScore(matchId, userId, updatedScore);
  }

  /**
   * WS: término del cliente
   */
  async handleClientFinish(socket: Socket) {
    const matchId = this.playerMatch.get(socket.id);
    if (!matchId) return;
    console.log(`Cliente terminó: ${socket.id}`);
  }

  /**
   * WS: desconexión
   */
  handleDisconnect(socket: Socket) {
    this.sockets.delete(socket.id);
    this.playerMatch.delete(socket.id);
  }

  /**
   * Finalizar partida oficialmente
   */
  async finalizeMatch(matchId: string) {
    const state = await this.stateRepo.getMatchState(matchId);
    const scores = await this.stateRepo.getMatchScores(matchId);

    const result = {
      matchId,
      songId: state.songId,
      difficulty: state.difficulty,
      endedAt: new Date(),
      players: Object.entries(scores).map(([userId, score]) => ({
        userId,
        score,
      })),
    };

    // Cleanup
    await this.stateRepo.deleteMatchState(matchId);

    return result;
  }

  /**
   * Obtener resultado (si existe)
   */
  async getMatchResult(matchId: string) {
    return this.stateRepo.getMatchState(matchId);
  }
}
