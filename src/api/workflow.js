import requester from './requester';

export default {
  getWorkflows: (params) => requester.get('/workflows', params),

  getWorkflow: (workflowId) => requester.get(`/workflows/${workflowId}`),

  postWorkflow: (data) => requester.post('/workflow', data),

  editWorkflow: (workflowId, data) =>
    requester.patch(`/workflows/${workflowId}`, data),

  deleteWorkflow: (workflowId) => requester.delete(`/workflows/${workflowId}`),

  getLogs: (params) => requester.get('workflow/logs', params),
};
