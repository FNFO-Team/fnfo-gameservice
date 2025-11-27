// src/config/redis.ts
import Redis from "ioredis";
import { env } from "./env";

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: false,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

/**
 * Logs importantes del ciclo de conexión
 */
redis.on("connect", () => {
  console.log("Redis connected:", env.REDIS_URL);
});

redis.on("ready", () => {
  console.log("Redis is ready to receive commands.");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

redis.on("reconnecting", () => {
  console.warn("Redis reconnecting...");
});

/**
 * Función para asegurar que Redis está conectado
 * (útil para integración inicial en server.ts)
 */
export async function initRedis() {
  try {
    await redis.ping();
    console.log("Redis ping OK");
  } catch (err) {
    console.error("Redis connection failed:", err);
    process.exit(1);
  }
}
