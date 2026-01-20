// User Types
export const UserRoleValues = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof UserRoleValues[keyof typeof UserRoleValues];

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: UserRole[];
  emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
  isAdmin: boolean;
}

// Auth Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

// Workflow Types
export interface HttpTrigger {
  type: 'http';
}

export interface FilterCondition {
  path: string;
  op: 'eq' | 'neq';
  value: any;
}

export interface TransformOperation {
  op: 'template' | 'default' | 'pick';
  to?: string;
  template?: string;
  path?: string;
  value?: any;
  paths?: string[];
}

export interface HttpRequestBody {
  mode: 'ctx' | 'custom';
  value?: Record<string, any>;
}

export type WorkflowStep =
  | {
      type: 'filter';
      conditions: FilterCondition[];
    }
  | {
      type: 'transform';
      ops: TransformOperation[];
    }
  | {
      type: 'http_request';
      method: 'GET' | 'POST';
      url: string;
      headers?: Record<string, string>;
      body: HttpRequestBody;
      timeoutMs?: number;
      retries?: number;
    };

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  trigger: {
    type: string;
    path: string;
  };
  steps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
  triggerUrl?: string;
}

export interface CreateWorkflowDto {
  name: string;
  description?: string;
  enabled?: boolean;
  trigger: HttpTrigger;
  steps: WorkflowStep[];
}

export interface UpdateWorkflowDto extends Partial<CreateWorkflowDto> {}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Workflow Run Types
export const WorkflowRunStatusValues = {
  RUNNING: 'running',
  SUCCESS: 'success',
  FAILED: 'failed',
  SKIPPED: 'skipped',
} as const;

export type WorkflowRunStatus = typeof WorkflowRunStatusValues[keyof typeof WorkflowRunStatusValues];

export interface WorkflowRunErrorDetails {
  step?: number;
  stepType?: string;
  message: string;
  stack?: string;
  code?: string;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  userId: string;
  status: WorkflowRunStatus;
  inputContext?: any;
  outputContext?: any;
  errorDetails?: WorkflowRunErrorDetails;
  stepCount: number;
  currentStep: number;
  startedAt: Date;
  completedAt?: Date;
  durationMs?: number;
  workflow?: Workflow;
}
