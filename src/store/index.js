import { createStore } from 'vuex';
import global from './global';
import workflow from './workflow';
import chain from './chain';
import log from './log';
import account from './account';
import editor from './editor';

export default createStore({
  modules: {
    global,
    workflow,
    log,
    chain,
    account,
    editor,
  },

  strict: true,
});
