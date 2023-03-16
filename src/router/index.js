import { createRouter, createWebHashHistory } from 'vue-router';
import { getSavedAuthToken } from '../api';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: async () => import('@/views/Home.vue'),
      meta: { signInRequired: true },
      children: [
        {
          path: '',
          redirect: { name: 'workflows' },
          component: () => import('@/views/Dashboard/Dashboard.vue'),
          meta: { signInRequired: true },
          children: [
            {
              path: 'workflows',
              name: 'workflows',
              component: () => import('@/views/Dashboard/Workflows.vue'),
              meta: { title: 'Workflows' },
            },
            {
              path: 'history',
              name: 'history',
              component: () => import('@/views/Dashboard/History.vue'),
              meta: { title: 'History' },
            },
            {
              path: '/workflow-summary/:id',
              props: true,
              component: () => import('@/views/WorkflowSummary/WorkflowSummary.vue'),
              meta: { title: 'Workflow Summary' },
              children: [
                { path: '', redirect: { name: 'overview' } },
                {
                  props: true,
                  path: 'overview',
                  name: 'overview',
                  component: () => import('@/views/WorkflowSummary/Overview.vue'),
                },
                {
                  path: 'logs',
                  name: 'logs',
                  component: () => import('@/views/WorkflowSummary/WorkflowLogs.vue'),
                },
              ],
            },
          ],
        },
        {
          path: '/editor/:id',
          props: true,
          component: () => import('@/views/Editor/Editor.vue'),
          meta: { title: 'Editor', signInRequired: true },
          children: [
            { path: '', redirect: { name: 'trigger' } },
            {
              path: 'trigger',
              name: 'trigger',
              component: () => import('@/views/Editor/Trigger/Trigger.vue'),
            },
            {
              path: 'action',
              name: 'action',
              component: () => import('@/views/Editor/Action/Action.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('@/views/WelcomeScreen.vue'),
      meta: { title: 'Welcome' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: () => import('@/views/NotFound.vue'),
      meta: { title: '404 Not Found' },
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/Test.vue'),
      meta: { title: 'Test' },
    },
  ],
});

router.beforeResolve((to, from, next) => {
  document.title = `${to.meta.title} | SubRelay`;
  if (to.matched.some((record) => record.meta.signInRequired)) {
    const connectedAccount = localStorage.getItem('polkadot-js-connected');

    const authToken = connectedAccount
      ? getSavedAuthToken(JSON.parse(connectedAccount).address)
      : null;

    if (authToken) {
      next();
    } else {
      next({ path: '/welcome' });
    }
  } else {
    next();
  }
});

export default router;
