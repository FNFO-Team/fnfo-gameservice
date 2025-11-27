// src/server.ts
import http from "http";
import dotenv from "dotenv";
import { Server as SocketIOServer } from "socket.io";

import app from "./app";
// Esta función la implementaremos en match.gateway.ts
import { registerMatchGateway } from "./game/match.gateway";

dotenv.config(); // Carga las variables de entorno desde .env

/**
 * Puertos y configuración básica
 * 
 * Más adelante puede moverse esto a src/config/env.ts,
 * pero por ahora lo dejamos directo aquí para que sea sencillo.
 */
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

// Orígenes permitidos para WebSocket/HTTP
const WS_ALLOW_ORIGINS = process.env.WS_ALLOW_ORIGINS
  ? process.env.WS_ALLOW_ORIGINS.split(",").map((o) => o.trim())
  : ["*"];

/**
 * Creación del servidor HTTP a partir de la app de Express
 */
const httpServer = http.createServer(app);

/**
 * Configuración el servidor de WebSocket (Socket.IO)
 * 
 * Este será el canal en tiempo real para:
 *  - client:ready
 *  - client:input
 *  - client:finish
 *  - server:start
 *  - server:scoreUpdate
 *  - server:matchEnded
 */
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: WS_ALLOW_ORIGINS,
    methods: ["GET", "POST"],
  },
});

/**
 * Registro del gateway de partidas (MatchGateway)
 * Aquí es donde, más adelante, implementaremos la lógica
 * para manejar las conexiones WS y delegarlas al MatchService.
 */
registerMatchGateway(io);

/**
 * Arranque del servidor HTTP + WebSocket
 */
httpServer.listen(PORT, () => {
  console.log(`FNFO GameService listening on port ${PORT}`);
  console.log(`WebSocket ready (Socket.IO), allowed origins: ${WS_ALLOW_ORIGINS.join(", ")}`);
});

/**
 * Manejo básico de errores no controlados,
 * para que el proceso no muera silenciosamente.
 */
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
