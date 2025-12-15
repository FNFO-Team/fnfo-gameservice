import { redis } from "../config/redis";
import {
  MatchConfig,
  LiveSnapshot,
  FinalResultSummary,
  MatchState,
} from "./dto";
import { env } from "../config/env";

export class StateRepository {
  private ttl = env.MATCH_TTL_SEC;

  private key(matchId: string, suffix: string) {
    return `match:${matchId}:${suffix}`;
  }

  /* ================== CONFIG ================== */

  async saveConfig(matchId: string, config: MatchConfig) {
    await redis.set(
      this.key(matchId, "config"),
      JSON.stringify(config),
      "EX",
      this.ttl
    );
  }

  async getConfig(matchId: string): Promise<MatchConfig | null> {
    const data = await redis.get(this.key(matchId, "config"));
    return data ? JSON.parse(data) : null;
  }

  /* ================== STATE ================== */

  async setState(matchId: string, state: MatchState) {
    await redis.set(
      this.key(matchId, "state"),
      state,
      "EX",
      this.ttl
    );
  }

  async getState(matchId: string): Promise<MatchState | null> {
    return (await redis.get(this.key(matchId, "state"))) as MatchState | null;
  }

  /* ================== PLAYERS ================== */

  async addPlayer(matchId: string, userId: string) {
    await redis.sadd(this.key(matchId, "players"), userId);
    await redis.expire(this.key(matchId, "players"), this.ttl);
  }

  async getPlayers(matchId: string): Promise<string[]> {
    return redis.smembers(this.key(matchId, "players"));
  }

  /* ================== SNAPSHOTS ================== */

  async saveSnapshot(
    matchId: string,
    userId: string,
    snapshot: LiveSnapshot
  ) {
    await redis.hset(
      this.key(matchId, "snapshots"),
      userId,
      JSON.stringify(snapshot)
    );
    await redis.expire(this.key(matchId, "snapshots"), this.ttl);
  }

  async getSnapshots(matchId: string): Promise<Record<string, LiveSnapshot>> {
    const raw = await redis.hgetall(this.key(matchId, "snapshots"));
    const parsed: Record<string, LiveSnapshot> = {};

    for (const userId in raw) {
      parsed[userId] = JSON.parse(raw[userId]);
    }

    return parsed;
  }

  /* ================== RESULTS ================== */

  async saveResult(
    matchId: string,
    userId: string,
    result: FinalResultSummary
  ) {
    await redis.hset(
      this.key(matchId, "results"),
      userId,
      JSON.stringify(result)
    );
    await redis.expire(this.key(matchId, "results"), this.ttl);
  }

  async getResults(
    matchId: string
  ): Promise<Record<string, FinalResultSummary>> {
    const raw = await redis.hgetall(this.key(matchId, "results"));
    const parsed: Record<string, FinalResultSummary> = {};

    for (const userId in raw) {
      parsed[userId] = JSON.parse(raw[userId]);
    }

    return parsed;
  }
}
