// src/common/httpClient.ts
import axios from "axios";
import axiosRetry from "axios-retry";

export const httpClient = axios.create({
  timeout: 5000,              // 5 segundos por request
  validateStatus: () => true, // Manejamos manualmente los códigos
});

// Reintentos automáticos para fallos transitorios
axiosRetry(httpClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkError(error) ||
      axiosRetry.isRetryableError(error)
    );
  },
});

// Interceptor para logs de salida
httpClient.interceptors.request.use((config) => {
  console.log(`-> [HTTP] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Interceptor para logs de respuesta y manejo de errores
httpClient.interceptors.response.use(
  (response) => {
    console.log(`<- [HTTP] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("HTTP Error:", error);
    return Promise.reject(error);
  }
);
