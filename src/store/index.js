import { createStore } from 'vuex';
import global from './global';
import workflow from './workflow';
import chain from './chain';
import log from './log';
import task from './task';
import account from './account';
import editor from './editor';

export default createStore({
  modules: {
    global,
    workflow,
    log,
    chain,
    task,
    account,
    editor,
  },

  strict: true,
});
