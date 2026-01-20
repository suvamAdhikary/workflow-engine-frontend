import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Editor from '@monaco-editor/react';
import { workflowsApi } from '../../api/workflows.api';
import { exampleWorkflow } from './StepExamples';
import type { CreateWorkflowDto, UpdateWorkflowDto, WorkflowStep } from '../../types';

export const WorkflowFormPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState<CreateWorkflowDto>({
    name: '',
    description: '',
    enabled: true,
    trigger: { type: 'http' },
    steps: [],
  });

  const [stepsJson, setStepsJson] = useState<string>('[]');
  const [jsonError, setJsonError] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  const { data: workflow, isLoading } = useQuery({
    queryKey: ['workflow', id],
    queryFn: () => workflowsApi.getById(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (workflow) {
      setFormData({
        name: workflow.name,
        description: workflow.description || '',
        enabled: workflow.enabled,
        trigger: workflow.trigger as { type: 'http' },
        steps: workflow.steps,
      });
      setStepsJson(JSON.stringify(workflow.steps, null, 2));
    }
  }, [workflow]);

  const createMutation = useMutation({
    mutationFn: workflowsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      navigate('/workflows');
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Failed to create workflow');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateWorkflowDto) => workflowsApi.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflow', id] });
      navigate('/workflows');
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Failed to update workflow');
    },
  });

  const validateSteps = (json: string): WorkflowStep[] | null => {
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) {
        setJsonError('Steps must be an array');
        return null;
      }
      if (parsed.length === 0) {
        setJsonError('At least one step is required');
        return null;
      }
      for (const step of parsed) {
        if (!step.type) {
          setJsonError('Each step must have a type');
          return null;
        }
        if (!['filter', 'transform', 'http_request'].includes(step.type)) {
          setJsonError(`Invalid step type: ${step.type}`);
          return null;
        }
      }
      setJsonError('');
      return parsed as WorkflowStep[];
    } catch (err) {
      setJsonError('Invalid JSON format');
      return null;
    }
  };

  const handleStepsChange = (value: string | undefined): void => {
    setStepsJson(value || '[]');
    validateSteps(value || '[]');
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormError('');

    const validatedSteps = validateSteps(stepsJson);
    if (!validatedSteps) {
      setFormError('Please fix the JSON errors before submitting');
      return;
    }

    const submitData: CreateWorkflowDto = {
      ...formData,
      steps: validatedSteps,
    };

    if (isEdit) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading workflow...</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEdit ? 'Edit Workflow' : 'Create Workflow'}
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          {isEdit
            ? 'Update your workflow configuration'
            : 'Define a new automation workflow with steps'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">{formError}</div>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                minLength={3}
                maxLength={100}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                maxLength={500}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex items-center">
              <input
                id="enabled"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              />
              <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
                Enable workflow
              </label>
            </div>
          </div>
        </div>

        {/* Steps Editor */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Workflow Steps</h2>
              <p className="text-sm text-gray-600 mt-1">
                Define your workflow steps as JSON. Each step can be: filter, transform, or
                http_request.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStepsJson(JSON.stringify(exampleWorkflow, null, 2))}
              className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
            >
              Load Example
            </button>
          </div>
          {jsonError && (
            <div className="mb-4 rounded-md bg-yellow-50 p-3">
              <div className="text-sm text-yellow-800">{jsonError}</div>
            </div>
          )}
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <Editor
              height="400px"
              defaultLanguage="json"
              value={stepsJson}
              onChange={handleStepsChange}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                lineNumbers: 'on',
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/workflows')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              createMutation.isPending ||
              updateMutation.isPending ||
              !!jsonError ||
              !formData.name
            }
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending || updateMutation.isPending
              ? 'Saving...'
              : isEdit
                ? 'Update Workflow'
                : 'Create Workflow'}
          </button>
        </div>
      </form>
    </div>
  );
};
