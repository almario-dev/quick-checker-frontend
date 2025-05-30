import { defineBoot } from '#q-app/wrappers';
import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { useAuthStore } from 'src/stores/auth';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Extend Axios config
// declare module 'axios' {
//   export interface AxiosRequestConfig {
//     mode?: 'renew' | 'default' | 'debounce';
//   }
// }

const api = axios.create({
  baseURL: (import.meta.env.VITE_HOST ?? 'http://localhost') + '/api',
  withCredentials: true,
  withXSRFToken: true,
});

export default defineBoot(({ app }) => {
  /*eslint-disable*/
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  // const getKey = (config: InternalAxiosRequestConfig<any>) => {
  //   let url = config.url || '';
  //   url = url.split('?')[0]?.replace(/^\//, '')?.toLowerCase() ?? '';
  //   return `${config.method}:${url}`;
  // };

  // const abortController = useAbortController();

  api.interceptors.request.use(
    (config) => {
      // const mode = config.mode;
      // const key = getKey(config);

      // console.log('mode detected', config);

      // if (mode === 'renew') {
      //   const existing = abortController.get(key);

      //   // abort previous request
      //   if (existing) abortController.abort(key);

      //   // create new controller
      //   const { signal } = abortController.create(key);
      //   config.signal = signal;
      // } else if (mode === 'debounce') {
      //   const existing = abortController.get(key);
      //   if (existing) {
      //     return Promise.reject(
      //       new axios.Cancel(`Debounced: A previous request for "${key}" is still pending.`),
      //     );
      //   }

      //   const { signal } = abortController.create(key);
      //   config.signal = signal;
      // }

      const auth = useAuthStore();
      const token = auth.getToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  api.interceptors.response.use(
    (response) => {
      // const key = getKey(response.config);
      // abortController.remove(key);
      return response;
    },
    (error) => {
      // if (error.config) {
      //   const key = getKey(error.config);
      //   abortController.remove(key);
      // }
      return Promise.reject(error);
    },
  );
});

export { api };
