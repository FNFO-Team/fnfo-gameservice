import { Server, Socket } from "socket.io";
import { MatchService } from "./match.service";
import {
  ClientReadyPayload,
  ClientSnapshotPayload,
  ClientFinishPayload,
} from "./dto";

export class MatchGateway {
  constructor(
    private readonly io: Server,
    private readonly matchService: MatchService
  ) {}

  /**
   * Registra los listeners WebSocket.
   */
  register() {
    this.io.on("connection", (socket: Socket) => {
      console.log("Client connected:", socket.id);

      socket.on("client:ready", (payload: ClientReadyPayload) => {
        this.matchService.handleClientReady(socket, payload);
      });

      socket.on("client:snapshot", (payload: ClientSnapshotPayload) => {
        this.matchService.handleClientSnapshot(socket, payload);
      });

      socket.on("client:finish", (payload: ClientFinishPayload) => {
        this.matchService.handleClientFinish(socket, payload);
      });

      socket.on("disconnect", () => {
        this.matchService.handleDisconnect(socket);
      });
    });
  }
}
