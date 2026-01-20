import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { runsApi } from '../../api/runs.api';
import { workflowsApi } from '../../api/workflows.api';
import { WorkflowRunStatusValues } from '../../types';
import type { WorkflowRun, WorkflowRunStatus } from '../../types';

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

export const RunHistoryPage = (): React.JSX.Element => {
  const { workflowId } = useParams<{ workflowId?: string }>();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const limit = 20;

  const { data: workflow } = useQuery({
    queryKey: ['workflow', workflowId],
    queryFn: () => workflowsApi.getById(workflowId!),
    enabled: !!workflowId,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['runs', workflowId, page, statusFilter],
    queryFn: () =>
      workflowId
        ? runsApi.getByWorkflowId(workflowId, { page, limit, status: statusFilter })
        : runsApi.getAll({ page, limit, status: statusFilter, workflowId }),
    enabled: true,
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
        <div className="text-gray-500">Loading run history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-800">
          Error loading run history: {(error as Error).message}
        </div>
      </div>
    );
  }

  const runs = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Run History</h1>
          {workflow && (
            <p className="mt-2 text-sm text-gray-700">
              Execution history for{' '}
              <Link
                to={`/workflows/${workflow.id}`}
                className="text-indigo-600 hover:text-indigo-900"
              >
                {workflow.name}
              </Link>
            </p>
          )}
          {!workflow && <p className="mt-2 text-sm text-gray-700">All workflow executions</p>}
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => setStatusFilter(undefined)}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            statusFilter === undefined
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        {Object.values(WorkflowRunStatusValues).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              statusFilter === status
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Runs Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {runs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No runs found.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Run ID
                    </th>
                    {!workflowId && (
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Workflow
                      </th>
                    )}
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Steps
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Duration
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Started
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {runs.map((run: WorkflowRun) => (
                    <tr key={run.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono text-gray-900 sm:pl-0">
                        <Link
                          to={`/runs/${run.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {run.id.substring(0, 8)}...
                        </Link>
                      </td>
                      {!workflowId && (
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {run.workflow ? (
                            <Link
                              to={`/workflows/${run.workflow.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              {run.workflow.name}
                            </Link>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      )}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            statusColors[run.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {statusLabels[run.status] || run.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {run.currentStep + 1} / {run.stepCount}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDuration(run.durationMs)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(run.startedAt).toLocaleString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <Link
                          to={`/runs/${run.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page <span className="font-medium">{page}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
