/**
 * Timestamp actual en milisegundos.
 */
export function now(): number {
  return Date.now();
}

/**
 * Genera un startTime global con offset (ej: 3 segundos).
 */
export function startTimeWithOffset(offsetMs: number): number {
  return now() + offsetMs;
}

/**
 * Delay simple (útil para tests o simulaciones).
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
