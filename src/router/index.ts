import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth-store';
import { useUserStore } from 'src/stores/user-store';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    try {
      const authStore = useAuthStore();
      const userStore = useUserStore();

      const hasToken: boolean = authStore.getToken !== null;

      // after page reload/refresh
      if (hasToken && !userStore.isAuthenticated) {
        await authStore.refresh();
      }

      // accessing auth pages but not signed in
      if (!userStore.isAuthenticated && to.meta.requireAuth) {
        return next({ name: 'Guest' });
      }

      // accessing guest-only pages while currently signed in
      if (to.meta.guestOnly && (userStore.isAuthenticated || hasToken)) {
        return next({ name: 'Dashboard' });
      }

      next();
    } catch (err) {
      // next({ name: 'Error' });
      next();
      console.error(err);
    }
  });

  return Router;
});
