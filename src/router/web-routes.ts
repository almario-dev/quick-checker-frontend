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
        path: 'register',
        name: 'Admin Login',
        component: () => import('pages/auth/RegisterPage.vue'),
      },
    ],
  },
];

export default webRoutes;
