import Redis from "ioredis";
import { env } from "./env";

/**
 * Cliente Redis compartido por todo el microservicio.
 */
export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: false,
  enableReadyCheck: true,
  maxRetriesPerRequest: null,
});

/**
 * Logs del ciclo de vida de Redis
 */
redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("ready", () => {
  console.log("Redis ready");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

redis.on("reconnecting", () => {
  console.warn("Redis reconnecting...");
});

/**
 * Verifica conexión con Redis al iniciar el servidor.
 */
export async function initRedis(): Promise<void> {
  try {
    await redis.ping();
    console.log("Redis ping OK");
  } catch (error) {
    console.error("Redis connection failed");
    process.exit(1);
  }
}
