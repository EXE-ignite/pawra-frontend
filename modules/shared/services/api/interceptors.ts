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
      // Only redirect to login when the user HAD a token (session expired)
      // Not when a request is made without a token (e.g. optional-auth endpoints)
      if (error.response?.status === 401 && tokenService.hasToken()) {
        tokenService.clearToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
      return Promise.reject(handleApiError(error));
    }
  );
}
