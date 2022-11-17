import { createStore } from 'vuex';
import global from './global';
import workflow from './workflow';
import event from './event';
import history from './history';
import task from './task';

export default createStore({
  modules: {
    global,
    workflow,
    history,
    event,
    task,
  },

  strict: true,
});
