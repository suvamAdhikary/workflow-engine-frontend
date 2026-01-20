import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiError, AuthTokens } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await axios.post<{ data: AuthTokens }>(
                `${API_BASE_URL}/auth/refresh`,
                { refreshToken }
              );

              const { accessToken, refreshToken: newRefreshToken } = response.data.data;
              this.setTokens(accessToken, newRefreshToken);

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }

              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    const key = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'workflow_engine_token';
    return localStorage.getItem(key);
  }

  private getRefreshToken(): string | null {
    const key = import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || 'workflow_engine_refresh_token';
    return localStorage.getItem(key);
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    const tokenKey = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'workflow_engine_token';
    const refreshKey = import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || 'workflow_engine_refresh_token';
    localStorage.setItem(tokenKey, accessToken);
    localStorage.setItem(refreshKey, refreshToken);
  }

  private clearTokens(): void {
    const tokenKey = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'workflow_engine_token';
    const refreshKey = import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || 'workflow_engine_refresh_token';
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(refreshKey);
  }

  public setAuthTokens(accessToken: string, refreshToken: string): void {
    this.setTokens(accessToken, refreshToken);
  }

  public clearAuthTokens(): void {
    this.clearTokens();
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
export default apiClient.getClient();
