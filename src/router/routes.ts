import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Guest',
    redirect: { name: 'Login' },
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      //
      { path: 'login', name: 'Login', component: () => import('pages/auth/LoginPage.vue') },
      {
        path: 'register',
        name: 'Register',
        component: () => import('pages/auth/RegisterPage.vue'),
      },
    ],
  },

  {
    path: '/',
    name: 'Auth',
    meta: { requireAuth: true },
    redirect: { name: 'Dashboard' },
    component: () => import('layouts/AppLayout.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('pages/DashboardPage.vue'),
      },
      {
        path: '/dashboard2',
        name: 'Dashboard2',
        component: () => import('pages/DashboardPage2.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
