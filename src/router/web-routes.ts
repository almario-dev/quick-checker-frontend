import { type RouteRecordRaw } from 'vue-router';

const webRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'Landing' },
    meta: { guestOnly: true },
    component: () => import('layouts/WebLayout.vue'),
    children: [
      // auth
      { path: '', name: 'Landing', component: () => import('pages/LandingPage.vue') },
      {
        path: 'login',
        name: 'Admin Login',
        component: () => import('pages/auth/AdminLoginPage.vue'),
      },
    ],
  },
];

export default webRoutes;
