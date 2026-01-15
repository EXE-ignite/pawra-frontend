import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse, RequestConfig } from '../../types/api.types';
import { setupInterceptors } from './interceptors';
import { tokenService } from './token.service';

class ApiService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setupInterceptors(this.client);
  }

  // Token management (delegate to tokenService)
  setToken(token: string): void {
    tokenService.setToken(token);
  }

  clearToken(): void {
    tokenService.clearToken();
  }

  getToken(): string | null {
    return tokenService.getToken();
  }

  // HTTP Methods
  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, config as AxiosRequestConfig);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, data, config as AxiosRequestConfig);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data, config as AxiosRequestConfig);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(url, data, config as AxiosRequestConfig);
    return response.data;
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url, config as AxiosRequestConfig);
    return response.data;
  }

  async uploadFile<T>(url: string, file: File, fieldName: string = 'file'): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}

export const apiService = new ApiService();
export default apiService;
