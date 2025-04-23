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
      { path: 'account', name: 'Account', component: () => import('pages/AccountPage.vue') },
      { path: 'recents', name: 'Recents', component: () => import('pages/RecentsPage.vue') },
      { path: 'settings', name: 'Settings', component: () => import('pages/SettingsPage.vue') },
    ],
  },

  // quick checker
  {
    path: '/quick-check',
    redirect: { name: 'Upload' },
    meta: { requireAuth: true },
    name: 'Quick Check',
    component: () => import('layouts/QuickCheckLayout.vue'),
    children: [
      { path: '', name: 'Upload', component: () => import('pages/quick-check/UploadPage.vue') },
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
