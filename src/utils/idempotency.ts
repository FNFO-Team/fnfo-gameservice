import { randomUUID } from "crypto";

/**
 * Genera una clave idempotente.
 * Si se pasa un seed (ej: matchId), será estable.
 */
export function generateIdempotencyKey(seed?: string): string {
  if (seed) {
    return `fnfo-${seed}`;
  }

  return `fnfo-${randomUUID()}`;
}
