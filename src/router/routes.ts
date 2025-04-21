import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // guest
  {
    path: '/',
    redirect: { name: 'Login' },
    meta: { guestOnly: true },
    name: 'Guest',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      // auth
      { path: 'login', name: 'Login', component: () => import('pages/auth/LoginPage.vue') },
      {
        path: 'register',
        name: 'Register',
        component: () => import('pages/auth/RegisterPage.vue'),
      },
    ],
  },

  // authenticated-user
  {
    path: '/',
    redirect: { name: 'Dashboard' },
    meta: { requireAuth: true },
    name: 'Auth',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // auth
      { path: '', name: 'Dashboard', component: () => import('pages/DashboardPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'Error',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
