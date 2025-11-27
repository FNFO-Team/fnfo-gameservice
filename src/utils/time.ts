// src/utils/time.ts

/**
 * Retorna timestamp actual en milisegundos.
 */
export function now(): number {
  return Date.now();
}

/**
 * Convierte segundos a milisegundos.
 */
export function sec(n: number): number {
  return n * 1000;
}

/**
 * Pausa la ejecución (solo para pruebas o tareas internas).
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Diferencia absoluta entre dos tiempos.
 */
export function diff(a: number, b: number): number {
  return Math.abs(a - b);
}

/**
 * Ajusta timestamp del cliente según latencia.
 */
export function applyLatency(timestamp: number, latency: number): number {
  return timestamp - latency / 2;
}
