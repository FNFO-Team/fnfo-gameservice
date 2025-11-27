// src/game/anticheat.service.ts

export class AntiCheatService {
  /**
   * Detecta si la secuencia de inputs es físicamente imposible
   * (intervalos demasiado cortos).
   */
  detectImpossibleSpeed(events: { timestamp: number }[]): boolean {
    if (events.length < 2) return false;

    for (let i = 1; i < events.length; i++) {
      const diff = events[i].timestamp - events[i - 1].timestamp;
      if (diff < 15) {
        // humano promedio: > 60 ms entre inputs
        return true;
      }
    }
    return false;
  }

  /**
   * Detecta patrones de precisión "demasiado perfectos" sin variación temporal.
   */
  detectLowVariancePerfects(events: { accuracy: number }[]): boolean {
    if (events.length < 10) return false;

    const values = events.map((e) => e.accuracy);
    const avg =
      values.reduce((acc, n) => acc + n, 0) / values.length;

    const variance =
      values.reduce((acc, n) => acc + Math.pow(n - avg, 2), 0) /
      values.length;

    return variance < 10; // 10 ms es demasiado perfecto para un humano promedio
  }

  /**
   * Validación general de inputs
   */
  validateInputSequence(
    events: { timestamp: number; accuracy: number }[]
  ): boolean {
    if (this.detectImpossibleSpeed(events)) return false;
    if (this.detectLowVariancePerfects(events)) return false;

    return true; // Todo correcto
  }
}
