import requester from './requester';

export default {
  getOperators: () => requester.get('/tasks/operators'),

  runTask: (data) => requester.post('tasks/run', data),
};
