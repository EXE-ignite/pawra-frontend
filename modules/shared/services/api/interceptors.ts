import { AxiosInstance } from 'axios';
import { tokenService } from './token.service';
import { handleApiError } from './error-handler';

export function setupInterceptors(client: AxiosInstance): void {
  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      const token = tokenService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      if (status === 401) {
        tokenService.clearToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
      }
      return Promise.reject(handleApiError(error));
    }
  );
}
