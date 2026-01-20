import apiClient from '../lib/api-client';
import type { WorkflowRun, PaginatedResponse, ApiResponse } from '../types';

export const runsApi = {
  getByWorkflowId: async (
    workflowId: string,
    params?: {
      page?: number;
      limit?: number;
      status?: string;
    }
  ): Promise<PaginatedResponse<WorkflowRun>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<WorkflowRun>>>(
      `/workflows/${workflowId}/runs`,
      { params }
    );
    return response.data.data;
  },

  getById: async (runId: string): Promise<WorkflowRun> => {
    const response = await apiClient.get<ApiResponse<WorkflowRun>>(`/runs/${runId}`);
    return response.data.data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    workflowId?: string;
  }): Promise<PaginatedResponse<WorkflowRun>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<WorkflowRun>>>('/runs', {
      params,
    });
    return response.data.data;
  },
};
