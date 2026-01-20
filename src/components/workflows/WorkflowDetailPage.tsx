import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { workflowsApi } from '../../api/workflows.api';

export const WorkflowDetailPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const { data: workflow, isLoading, error } = useQuery({
    queryKey: ['workflow', id],
    queryFn: () => workflowsApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading workflow...</div>
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-800">
          Error loading workflow: {(error as Error)?.message || 'Workflow not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to="/workflows"
          className="text-sm text-indigo-600 hover:text-indigo-900 mb-4 inline-block"
        >
          ← Back to Workflows
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{workflow.name}</h1>
            {workflow.description && (
              <p className="mt-2 text-sm text-gray-700">{workflow.description}</p>
            )}
          </div>
          <Link
            to={`/workflows/${workflow.id}/edit`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Status</h2>
          <div className="flex items-center gap-4">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                workflow.enabled
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {workflow.enabled ? 'Enabled' : 'Disabled'}
            </span>
            <span className="text-sm text-gray-500">
              Created: {new Date(workflow.createdAt).toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              Updated: {new Date(workflow.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Trigger URL */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Webhook Trigger</h2>
          {workflow.triggerUrl ? (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Use this URL to trigger your workflow via HTTP POST:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-100 px-4 py-2 rounded-md text-sm break-all">
                  {workflow.triggerUrl}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(workflow.triggerUrl || '');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                >
                  Copy
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No trigger URL available</p>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
          <div className="flex gap-4">
            <Link
              to={`/workflows/${workflow.id}/runs`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
            >
              View Run History
            </Link>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Workflow Steps ({workflow.steps.length})
          </h2>
          <div className="space-y-4">
            {workflow.steps.map((step, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    Step {index + 1}: {step.type}
                  </span>
                </div>
                <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                  {JSON.stringify(step, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
