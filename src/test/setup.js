import { createStore } from 'vuex';
import { NButton, NCard, NModal, NSpace, NScrollbar, NText, NTooltip, NEllipsis, NInput, NAvatar } from 'naive-ui';
import { Icon } from '@iconify/vue';

export const createMockStore = (modules) => {
  return createStore({
    modules: modules.reduce((result, module) => {
      return {
        ...result,
        [module.name]: {
          namespaced: true,
          state: module.state,
        },
      };
    }, {}),
  });
};

export const globalComponents = {
  'n-button': NButton,
  'n-card': NCard,
  'n-modal': NModal,
  'n-space': NSpace,
  'n-text': NText,
  'n-scrollbar': NScrollbar,
  'n-tooltip': NTooltip,
  'n-ellipsis': NEllipsis,
  'n-input': NInput,
  'n-avatar': NAvatar,
  'Icon': Icon,
};
