import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { runsApi } from '../../api/runs.api';
import { workflowsApi } from '../../api/workflows.api';
import { WorkflowRunStatusValues } from '../../types';
import type { WorkflowRunStatus } from '../../types';

const statusColors: Record<WorkflowRunStatus, string> = {
  [WorkflowRunStatusValues.SUCCESS]: 'bg-green-100 text-green-800',
  [WorkflowRunStatusValues.FAILED]: 'bg-red-100 text-red-800',
  [WorkflowRunStatusValues.RUNNING]: 'bg-blue-100 text-blue-800',
  [WorkflowRunStatusValues.SKIPPED]: 'bg-yellow-100 text-yellow-800',
};

const statusLabels: Record<WorkflowRunStatus, string> = {
  [WorkflowRunStatusValues.SUCCESS]: 'Success',
  [WorkflowRunStatusValues.FAILED]: 'Failed',
  [WorkflowRunStatusValues.RUNNING]: 'Running',
  [WorkflowRunStatusValues.SKIPPED]: 'Skipped',
};

export const RunDetailPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const { data: run, isLoading, error } = useQuery({
    queryKey: ['run', id],
    queryFn: () => runsApi.getById(id!),
    enabled: !!id,
  });

  const { data: workflow } = useQuery({
    queryKey: ['workflow', run?.workflowId],
    queryFn: () => workflowsApi.getById(run!.workflowId),
    enabled: !!run?.workflowId,
  });

  const formatDuration = (durationMs?: number): string => {
    if (!durationMs) return 'N/A';
    if (durationMs < 1000) return `${durationMs}ms`;
    if (durationMs < 60000) return `${(durationMs / 1000).toFixed(1)}s`;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(1);
    return `${minutes}m ${seconds}s`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading run details...</div>
      </div>
    );
  }

  if (error || !run) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-800">
          Error loading run: {(error as Error)?.message || 'Run not found'}
        </div>
      </div>
    );
  }

  const progressPercentage =
    run.stepCount > 0 ? Math.round((run.currentStep / run.stepCount) * 100) : 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to={workflow ? `/workflows/${workflow.id}/runs` : '/runs'}
          className="text-sm text-indigo-600 hover:text-indigo-900 mb-4 inline-block"
        >
          ← Back to Run History
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Run Details</h1>
            <p className="mt-2 text-sm text-gray-500 font-mono">{run.id}</p>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
              statusColors[run.status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {statusLabels[run.status] || run.status}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Overview */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Workflow</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {workflow ? (
                  <Link
                    to={`/workflows/${workflow.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {workflow.name}
                  </Link>
                ) : (
                  <span className="text-gray-400">Unknown</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                    statusColors[run.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {statusLabels[run.status] || run.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Started At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(run.startedAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Completed At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {run.completedAt ? new Date(run.completedAt).toLocaleString() : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Duration</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDuration(run.durationMs)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Progress</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {run.currentStep + 1} / {run.stepCount} steps ({progressPercentage}%)
              </dd>
            </div>
          </dl>
          {run.stepCount > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Execution Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    run.status === WorkflowRunStatusValues.SUCCESS
                      ? 'bg-green-600'
                      : run.status === WorkflowRunStatusValues.FAILED
                        ? 'bg-red-600'
                        : run.status === WorkflowRunStatusValues.RUNNING
                          ? 'bg-blue-600'
                          : 'bg-yellow-600'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Error Details */}
        {run.errorDetails && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Error Details</h2>
            <div className="space-y-2">
              {run.errorDetails.step !== undefined && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Failed Step: </span>
                  <span className="text-sm text-gray-900">
                    Step {run.errorDetails.step + 1}
                    {run.errorDetails.stepType && ` (${run.errorDetails.stepType})`}
                  </span>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-gray-700">Message: </span>
                <span className="text-sm text-red-600">{run.errorDetails.message}</span>
              </div>
              {run.errorDetails.code && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Error Code: </span>
                  <span className="text-sm text-gray-900">{run.errorDetails.code}</span>
                </div>
              )}
              {run.errorDetails.stack && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-700 block mb-2">Stack Trace:</span>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                    {run.errorDetails.stack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Input Context */}
        {run.inputContext && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Input Context</h2>
            <pre className="text-xs bg-gray-50 p-4 rounded overflow-x-auto">
              {JSON.stringify(run.inputContext, null, 2)}
            </pre>
          </div>
        )}

        {/* Output Context */}
        {run.outputContext && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Output Context</h2>
            <pre className="text-xs bg-gray-50 p-4 rounded overflow-x-auto">
              {JSON.stringify(run.outputContext, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
