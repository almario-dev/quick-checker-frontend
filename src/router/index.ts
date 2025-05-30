import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth';
import { dialog } from 'src/composables/usePopup';

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

  Router.beforeEach(async (to) => {
    try {
      const auth = useAuthStore();

      /**
       * Hydrate user data (from page reload/refresh)
       */

      const hasTokenButNoUser: boolean = auth.getToken !== null && !auth.hasUser;

      if (hasTokenButNoUser) {
        await auth.refresh();
      }

      /**
       * Accessing auth pages from guest user
       */

      const guestGoingToAuth: boolean =
        (to.meta.requireAuth as boolean) && (!auth.hasUser || auth.getToken === null);

      if (guestGoingToAuth) {
        return { name: 'Guest' };
      }

      /**
       * Accessing guest pages while currently signed in
       */

      const authGoingToGuest: boolean =
        to.meta?.requireAuth == undefined && auth.hasUser && auth.getToken !== null;

      if (authGoingToGuest) {
        return { name: 'Dashboard' };
      }
    } catch {
      await dialog({
        title: 'Invalid session',
        message: 'Your session has expired or is invalid. Please log in again to continue.',
        icon: 'error',
        iconBg: 'bg-red-2',
        iconClass: 'text-red-5',
      });

      return { name: 'Guest' };
    }
  });

  return Router;
});
