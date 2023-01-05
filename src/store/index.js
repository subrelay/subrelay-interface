import { createStore } from 'vuex';
import global from './global';
import workflow from './workflow';
import chain from './chain';
import history from './history';
import task from './task';
import account from './account';

export default createStore({
  modules: {
    global,
    workflow,
    history,
    chain,
    task,
    account,
  },

  strict: true,
});
