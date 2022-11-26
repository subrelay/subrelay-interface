import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/welcome' },
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('../views/WelcomeScreen.vue'),
      meta: { title: 'Welcome' },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: {
        requiresAuth: true,
        title: 'Home',
      },
      children: [
        {
          path: 'workflows',
          name: 'workflows',
          component: () => import('../views/Workflows.vue'),
        },
        {
          path: 'history',
          name: 'history',
          component: () => import('../views/History.vue'),
        },
      ],
    },
    {
      path: '/editor/:id',
      props: true,
      component: () => import('../views/Editor.vue'),
      meta: {
        requiresAuth: true,
        title: 'Editor',
      },
      children: [
        { path: '', redirect: { name: 'trigger' } },
        {
          path: 'trigger',
          name: 'trigger',
          component: () => import('@/components/Trigger/Trigger.vue'),
        },
        {
          path: 'action',
          name: 'action',
          component: () => import('@/components/Action/Action.vue'),
        },
      ],
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/Test.vue'),
    },
  ],
});

router.beforeResolve((to, from, next) => {
  document.title = `${to.meta.title}`;
  // if (to.matched.some((record) => record.meta.requiresAuth)) {
  //   Auth.currentAuthenticatedUser()
  //     .then(() => {
  //       next();
  //     })
  //     .catch(() => {
  //       next({ path: '/welcome' });
  //     });
  // } else {
  //   next();
  // }
  next();
});

export default router;
