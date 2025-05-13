import { type RouteRecordRaw } from 'vue-router';

const mobileRoutes: RouteRecordRaw[] = [
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
      { path: 'account', name: 'Profile', component: () => import('pages/AccountPage.vue') },
      { path: 'recents', name: 'Recents', component: () => import('pages/RecentsPage.vue') },
      { path: 'settings', name: 'Settings', component: () => import('pages/SettingsPage.vue') },
    ],
  },

  // app
  {
    path: '/',
    redirect: { name: 'Create Answer Key' },
    meta: { requireAuth: true },
    name: 'App',
    component: () => import('layouts/FullScreenLayout.vue'),
    children: [
      // ...
      {
        path: 'create-answer-key',
        name: 'Create Answer Key',
        component: () => import('src/pages/AnswerKeyCreatePage.vue'),
      },
      {
        path: 'answer-key-details/:id',
        name: 'Answer Key Details',
        props: true,
        component: () => import('src/pages/AnswerKeyDetailsPage.vue'),
      },
      {
        path: 'scan-answer-sheets',
        name: 'Scan Answer Sheets',
        component: () => import('pages/AnswerSheetScanPage.vue'),
      },
    ],
  },
];

export default mobileRoutes;
