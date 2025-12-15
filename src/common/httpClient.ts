import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * Cliente HTTP centralizado para integraciones externas.
 */
class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor de request (opcional, útil para logs)
    this.client.interceptors.request.use((config) => {
      return config;
    });

    // Interceptor de response (errores controlados)
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Error HTTP del servicio externo
          return Promise.resolve(error.response);
        }
        // Error de red, timeout, etc.
        return Promise.reject(error);
      }
    );
  }

  get(url: string, config?: AxiosRequestConfig) {
    return this.client.get(url, config);
  }

  post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.post(url, data, config);
  }

  put(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.put(url, data, config);
  }

  delete(url: string, config?: AxiosRequestConfig) {
    return this.client.delete(url, config);
  }
}

export const httpClient = new HttpClient();
