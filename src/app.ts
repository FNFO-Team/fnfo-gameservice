// src/app.ts
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";

// Cuando implementemos estas piezas, estas rutas existirán:
import { gameRouter } from "./game/game.routes";
import { errorHandler } from "./common/errorHandler";

const app: Application = express();

/**
 * Middlewares globales
 */
app.use(cors());                 // Permitir CORS (frontend ENFO)
app.use(express.json());        // Parsear JSON en los body
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));         // Logs HTTP en consola

/**
 * Rutas base
 * 
 * Todo lo relacionado con el juego va colgado en /api/game
 * Dentro de game.routes.ts definiremos:
 *  - GET /health
 *  - POST /start
 *  - POST /end
 *  - GET  /match/:id
 */
app.use("/api/game", gameRouter);

/**
 * Ruta simple de prueba (opcional, útil mientras montas todo)
 */
app.get("/", (_req, res) => {
  res.json({ message: "FNFO GameService is running" });
});

/**
 * Middleware global de manejo de errores
 * (debe ir siempre al final de la cadena de middlewares)
 */
app.use(errorHandler);

export default app;
