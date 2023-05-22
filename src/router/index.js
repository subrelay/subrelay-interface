import { createRouter, createWebHistory } from 'vue-router';
import { getSavedAuthToken } from '../api';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: async () => import('@/views/Home'),
      meta: { signInRequired: true },
      children: [
        {
          path: '',
          redirect: { name: 'workflows' },
          component: () => import('@/views/Dashboard/Dashboard'),
          meta: { signInRequired: true },
          children: [
            {
              path: 'workflows',
              name: 'workflows',
              component: () => import('@/views/Dashboard/Workflows'),
              meta: { title: 'Workflows' },
            },
            {
              path: '/workflows/:id',
              props: true,
              component: () => import('@/views/WorkflowSummary/WorkflowSummary'),
              meta: { title: 'Workflow Summary' },
              children: [
                { path: '', redirect: { name: 'overview' } },
                {
                  props: true,
                  path: 'overview',
                  name: 'overview',
                  component: () => import('@/views/WorkflowSummary/Overview'),
                },
                {
                  props: true,
                  path: 'logs',
                  name: 'workflowLogs',
                  component: () => import('@/views/WorkflowSummary/WorkflowLogs'),
                },
              ],
            },
            {
              path: 'logs',
              name: 'logs',
              component: () => import('@/views/Dashboard/Logs'),
              meta: { title: 'Logs' },
            },
            {
              path: 'logs/:id',
              name: 'logDetails',
              props: true,
              component: () => import('@/views/LogDetails'),
              meta: { title: 'Log Details' },
            },
          ],
        },
        {
          path: '/editor',
          props: true,
          component: () => import('@/views/Editor/Editor'),
          meta: { title: 'Editor', signInRequired: true },
          children: [
            { path: '', redirect: { name: 'trigger' } },
            {
              path: 'trigger',
              name: 'trigger',
              component: () => import('@/views/Editor/Trigger/Trigger'),
            },
            {
              path: 'action',
              name: 'action',
              component: () => import('@/views/Editor/Action/Action'),
            },
          ],
        },
      ],
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('@/views/WelcomeScreen'),
      meta: { title: 'Welcome' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: () => import('@/views/NotFound'),
      meta: { title: '404 Not Found' },
    },
    // {
    //   path: '/test',
    //   name: 'Test',
    //   component: () => import('@/views/Test'),
    //   meta: { title: 'Test' },
    // },
  ],
});

router.beforeResolve((to, from, next) => {
  document.title = `${to.meta.title} | SubRelay`;
  if (to.matched.some((record) => record.meta.signInRequired)) {
    const connectedAccount = localStorage.getItem('polkadot-js-connected');

    const authToken = connectedAccount ? getSavedAuthToken(JSON.parse(connectedAccount).address) : null;

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
