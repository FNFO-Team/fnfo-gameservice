// src/game/match.gateway.ts
// registra el WebSocket y define los eventos base
import { Server, Socket } from "socket.io";
import { MatchService } from "./match.service";

const matchService = new MatchService();

/**s
 * Registra el gateway de WebSocket.
 * Se llama desde server.ts
 */
export function registerMatchGateway(io: Server) {
  console.log("MatchGateway initialized");

  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);

    /**
     * Cliente indica que está listo para jugar
     */
    socket.on("client:ready", async (payload) => {
      await matchService.handleClientReady(socket, payload);
    });

    /**
     * Cliente envía input (teclas presionadas)
     */
    socket.on("client:input", async (payload) => {
      await matchService.handleClientInput(socket, payload);
    });

    /**
     * Cliente terminó la canción
     */
    socket.on("client:finish", async () => {
      await matchService.handleClientFinish(socket);
    });

    /**
     * Cliente desconectado
     */
    socket.on("disconnect", () => {
      matchService.handleDisconnect(socket);
      console.log("Client disconnected:", socket.id);
    });
  });
}
