import apiClient from '../lib/api-client';
import type { LoginDto, RegisterDto, RefreshTokenDto, AuthResponse, ApiResponse } from '../types';

export const authApi = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/register', data);
    return response.data.data;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
    return response.data.data;
  },

  refreshToken: async (data: RefreshTokenDto): Promise<AuthResponse['tokens']> => {
    const response = await apiClient.post<ApiResponse<AuthResponse['tokens']>>('/api/auth/refresh', data);
    return response.data.data;
  },

  getProfile: async (): Promise<AuthResponse['user']> => {
    const response = await apiClient.get<ApiResponse<AuthResponse['user']>>('/api/auth/profile');
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
  },
};
