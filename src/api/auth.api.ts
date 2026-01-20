import apiClient from '../lib/api-client';
import type { LoginDto, RegisterDto, RefreshTokenDto, AuthResponse, ApiResponse } from '../types';

export const authApi = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  },

  refreshToken: async (data: RefreshTokenDto): Promise<AuthResponse['tokens']> => {
    const response = await apiClient.post<ApiResponse<AuthResponse['tokens']>>('/auth/refresh', data);
    return response.data.data;
  },

  getProfile: async (): Promise<AuthResponse['user']> => {
    const response = await apiClient.get<ApiResponse<AuthResponse['user']>>('/auth/profile');
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
