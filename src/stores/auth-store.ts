import { type IndeterminateData } from './../composables/types/app';
import type { IUserLogin, IUserRegistration } from './../composables/interfaces/IUser';
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { AuthToken, UserData } from 'src/composables/types/auth';
import { computed, ref } from 'vue';
import { useUserStore } from './user-store';
import type { AxiosResponse } from 'axios';

interface UserRes {
  user: Record<string, string>;
  config: Record<string, IndeterminateData>;
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<AuthToken>(null);
    const getToken = computed(() => token.value);

    const userStore = useUserStore();

    const setToken = (newToken: AuthToken): void => {
      token.value = newToken;
    };

    const hydrateUserData = (data: UserRes) => {
      const { name, email, role } = data.user;

      if (!name || !email || !role) {
        throw new Error('Incorrect definition of data');
      }

      if (role !== 'admin' && role !== 'teacher') {
        throw new Error('Invalid role');
      }

      userStore.setData({ name, email, role });

      if (data.config) {
        const { similarity_threshold } = data.config;

        if (similarity_threshold) {
          userStore.settings.similarity_threshold = Number(similarity_threshold) || 75;
        }
      }
    };

    const extractTokenResource = (response: AxiosResponse) => {
      const resource: string | null = response?.headers['resource-id'] ?? null;
      setToken(resource);
    };

    const register = (user: IUserRegistration): Promise<UserData> => {
      return new Promise((resolve, reject): void => {
        api
          .post('register', user)
          .then((response: AxiosResponse) => {
            // get token from headers
            extractTokenResource(response);

            // save user data
            hydrateUserData(response.data);

            resolve(userStore.getData);
          })
          .catch((err) => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(err);
          });
      });
    };

    const login = (credentials: IUserLogin): Promise<UserData> => {
      return new Promise((resolve, reject): void => {
        api
          .post('login', credentials)
          .then((response: AxiosResponse) => {
            // get token from headers
            extractTokenResource(response);

            // save user data
            hydrateUserData(response.data);

            resolve(userStore.getData);
          })
          .catch((err) => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(err);
          });
      });
    };

    const refresh = (): Promise<UserData> => {
      return new Promise((resolve, reject): void => {
        api
          .get('refresh')
          .then((response: AxiosResponse) => {
            extractTokenResource(response);

            hydrateUserData(response.data);

            resolve(userStore.getData);
          })
          .catch((err) => {
            setToken(null);

            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(err);
          });
      });
    };

    const logout = (): Promise<void> => {
      return new Promise((resolve, reject): void => {
        api
          .get('logout')
          .then(() => {
            setToken(null);
            userStore.setData(null);
            userStore.settings.similarity_threshold = 75;
            resolve();
          })
          .catch((err) => {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(err);
          });
      });
    };

    return { token, getToken, setToken, register, login, refresh, logout };
  },
  {
    persist: {
      pick: ['token'],
    },
  },
);
