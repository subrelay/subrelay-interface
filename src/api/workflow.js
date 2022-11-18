import requester from './requester';

export default {
  getWorkflows: (params) => requester.get('/workflows', params),

  getWorkflow: (workflow_id) => requester.get(`/workflows/${workflow_id}`),

  postWorkflow: (data) => requester.post('/workflow', data),

  deleteWorkflow: (workflow_id) =>
    requester.delete(`/workflows/${workflow_id}`),

  getLogs: (params) => requester.get('workflow/logs', params),
};
