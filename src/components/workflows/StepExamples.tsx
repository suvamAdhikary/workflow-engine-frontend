export const stepExamples = {
  filter: {
    type: 'filter',
    conditions: [
      { path: 'event_type', op: 'eq', value: 'user.signup' },
      { path: 'user.verified', op: 'eq', value: true },
    ],
  },
  transform: {
    type: 'transform',
    ops: [
      { op: 'template', to: 'message', template: 'New user: {{user.email}}' },
      { op: 'default', to: 'user_name', path: 'user.name', value: 'Anonymous' },
      { op: 'pick', paths: ['id', 'email', 'name'] },
    ],
  },
  http_request: {
    type: 'http_request',
    method: 'POST',
    url: 'https://hooks.slack.com/services/XXX/YYY/ZZZ',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': '{{api_key}}',
    },
    body: {
      mode: 'custom',
      value: {
        text: '{{message}}',
        user: '{{user_name}}',
      },
    },
    timeoutMs: 5000,
    retries: 3,
  },
};

export const exampleWorkflow = [
  stepExamples.filter,
  stepExamples.transform,
  stepExamples.http_request,
];
