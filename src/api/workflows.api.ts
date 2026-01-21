import apiClient from '../lib/api-client';
import type {
  Workflow,
  CreateWorkflowDto,
  UpdateWorkflowDto,
  PaginatedResponse,
  ApiResponse,
} from '../types';

export const workflowsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    enabled?: boolean;
  }): Promise<PaginatedResponse<Workflow>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Workflow>>>('/api/workflows', {
      params,
    });
    return response.data.data;
  },

  getById: async (id: string): Promise<Workflow> => {
    const response = await apiClient.get<ApiResponse<Workflow>>(`/api/workflows/${id}`);
    return response.data.data;
  },

  create: async (data: CreateWorkflowDto): Promise<Workflow> => {
    const response = await apiClient.post<ApiResponse<Workflow>>('/api/workflows', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateWorkflowDto): Promise<Workflow> => {
    const response = await apiClient.patch<ApiResponse<Workflow>>(`/api/workflows/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/workflows/${id}`);
  },
};
