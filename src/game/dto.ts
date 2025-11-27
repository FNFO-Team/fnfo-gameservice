// src/game/dto.ts

export interface MatchConfig {
  matchId: string;
  players: string[];
  songId: string;
  difficulty: string;
  bpm: number;
  startTime?: number;
}

export interface InputEvent {
  userId: string;
  noteId: string;
  timestamp: number;   // tiempo local del cliente
  expected: number;    // tiempo ideal de la nota
  judgment?: string;   // opcional si el cliente lo calcula
}

export interface PlayerStats {
  userId: string;
  score: number;
  perfect: number;
  great: number;
  good: number;
  miss: number;
  comboMax?: number;
  accuracy?: number;
  latency?: number;
}

export interface MatchResult {
  matchId: string;
  songId: string;
  difficulty: string;
  endedAt: Date;
  players: PlayerStats[];
}
