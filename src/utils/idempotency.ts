// src/utils/idempotency.ts
import { randomUUID } from "crypto";

/**
 * Genera una clave única idempotente para peticiones POST a otros microservicios.
 */
export function generateIdempotencyKey(seed?: string): string {
  if (seed) return `fnfo-${seed}`;

  return `fnfo-${randomUUID()}`;
}


/**
 * EJEMPLO DE USO:
 * httpClient.post(url, data, {
 *   headers: { "Idempotency-Key": generateIdempotencyKey(matchId) }
 * });
 */