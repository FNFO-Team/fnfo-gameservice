import http from "http";
import { Server } from "socket.io";
import { createApp } from "./app";
import { env } from "./config/env";
import { initRedis } from "./config/redis";
import { MatchGateway } from "./game/match.gateway";
import { MatchService } from "./game/match.service";
import { StateRepository } from "./game/state.repository";

async function bootstrap() {
  // Crear app Express
  const app = createApp();

  // Crear servidor HTTP
  const server = http.createServer(app);

  // Inicializar Redis
  await initRedis();

  // Inicializar Socket.IO
  const io = new Server(server, {
    cors: {
      origin: env.WS_ALLOW_ORIGINS,
    },
  });

  // Dependencias del dominio
  const stateRepository = new StateRepository();
  const matchService = new MatchService(stateRepository);
  matchService.attachIO(io);

  // WebSocket Gateway
  const gateway = new MatchGateway(io, matchService);
  gateway.register();

  // Levantar servidor
  server.listen(env.PORT, () => {
    console.log(`GameService running on port ${env.PORT}`);
  });
}

// Arranque
bootstrap().catch((err) => {
  console.error("Failed to start GameService:", err);
  process.exit(1);
});
