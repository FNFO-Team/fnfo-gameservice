// src/game/sync.service.ts

export class SyncService {
  /**
   * Devuelve el "startTime" global que todos los clientes usarán.
   * Generalmente es Date.now() + offset (3 segundos por ejemplo).
   */
  getGlobalStartTime(offsetMs = 3000): number {
    return Date.now() + offsetMs;
  }

  /**
   * Calcula la latencia promedio de un conjunto de pings.
   */
  computeLatency(pingSamples: number[]): number {
    if (pingSamples.length === 0) return 0;
    const sum = pingSamples.reduce((acc, n) => acc + n, 0);
    return Math.round(sum / pingSamples.length);
  }

  /**
   * Ajusta el timestamp del cliente según su latencia estimada.
   * Ayuda a calcular accuracy del lado del servidor.
   */
  adjustTimestamp(clientTimestamp: number, latency: number): number {
    return clientTimestamp - latency / 2;
  }
}
