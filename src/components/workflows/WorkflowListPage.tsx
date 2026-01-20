import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowsApi } from '../../api/workflows.api';
import type { Workflow } from '../../types';

export const WorkflowListPage = (): React.JSX.Element => {
  const [page, setPage] = useState(1);
  const [enabledFilter, setEnabledFilter] = useState<boolean | undefined>(undefined);
  const limit = 20;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['workflows', page, enabledFilter],
    queryFn: () => workflowsApi.getAll({ page, limit, enabled: enabledFilter }),
  });

  const deleteMutation = useMutation({
    mutationFn: workflowsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  const handleDelete = async (id: string, name: string): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete workflow "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading workflows...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-800">
          Error loading workflows: {(error as Error).message}
        </div>
      </div>
    );
  }

  const workflows = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Workflows</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your automation workflows and webhook triggers
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/workflows/new"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create Workflow
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => setEnabledFilter(undefined)}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            enabledFilter === undefined
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setEnabledFilter(true)}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            enabledFilter === true
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Enabled
        </button>
        <button
          onClick={() => setEnabledFilter(false)}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            enabledFilter === false
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Disabled
        </button>
      </div>

      {/* Workflows Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {workflows.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No workflows found.</p>
                <Link
                  to="/workflows/new"
                  className="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
                >
                  Create your first workflow
                </Link>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Name
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Steps
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Trigger URL
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {workflows.map((workflow: Workflow) => (
                    <tr key={workflow.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        <Link
                          to={`/workflows/${workflow.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {workflow.name}
                        </Link>
                        {workflow.description && (
                          <div className="text-xs text-gray-500 mt-1">{workflow.description}</div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            workflow.enabled
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {workflow.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {workflow.steps.length} step{workflow.steps.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {workflow.triggerUrl ? (
                          <div className="max-w-xs">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">
                              {workflow.triggerUrl}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(workflow.triggerUrl || '');
                              }}
                              className="ml-2 text-indigo-600 hover:text-indigo-900 text-xs"
                            >
                              Copy
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(workflow.createdAt).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/workflows/${workflow.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(workflow.id, workflow.name)}
                            disabled={deleteMutation.isPending}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
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
