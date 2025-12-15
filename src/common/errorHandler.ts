import { Request, Response, NextFunction } from "express";

export interface HttpError extends Error {
  status?: number;
}

/**
 * Middleware global de manejo de errores.
 * Debe registrarse al FINAL de los middlewares de Express.
 */
export function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status ?? 500;

  console.error("Error:", {
    message: err.message,
    status,
    path: req.path,
    method: req.method,
  });

  res.status(status).json({
    error: {
      message: err.message || "Internal server error",
      status,
    },
  });
}
