import { Platform } from 'quasar';
import { computed } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import mobileRoutes from './mobile-routes';
import webRoutes from './web-routes';

const notMobile = computed(() => !Platform.is.nativeMobileWrapper);

const routes: RouteRecordRaw[] = [
  ...(notMobile.value ? webRoutes : mobileRoutes),

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'Error',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
