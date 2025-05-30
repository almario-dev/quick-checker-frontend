import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { api } from 'src/boot/axios';
import type { AuthToken, LoginForm, RegisterForm } from 'src/types/auth';
import { type User } from 'src/types/auth';
import { AxiosError, type AxiosResponse } from 'axios';
import { notify } from 'src/composables/usePopup';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null);
    const token = ref<AuthToken>(null);

    const getToken = computed(() => token.value);
    const hasUser = computed((): boolean => user.value !== null && !!user.value.email);

    const assign = (response: AxiosResponse) => {
      try {
        // extract token from header
        const resourceToken = response?.headers['resource-id'] ?? null;
        token.value = resourceToken;

        // user data
        const { account } = response.data;
        user.value = account ?? null;
      } catch (e) {
        notify({
          type: 'warning',
          message: 'Unable to find account data.',
        });
        console.error(e);
      }
    };

    const register = async (form: RegisterForm): Promise<void> => {
      try {
        const data = await api.post('register', form);
        assign(data);
        notify({
          type: 'positive',
          message: 'Registration successful! Your account has been created.',
        });
      } catch (err) {
        if (err instanceof AxiosError) {
          notify({
            type: 'negative',
            message: 'Registration failed. Please check your details and try again.',
          });
        }
        throw err;
      }
    };

    const login = async (form: LoginForm): Promise<void> => {
      try {
        const data = await api.post('login', form);
        assign(data);
      } catch (err) {
        if (err instanceof AxiosError) {
          notify({
            type: 'negative',
            message: 'Login failed. Please check your credentials and try again.',
          });
        }
        throw err;
      }
    };

    const refresh = async (): Promise<void> => {
      try {
        const data = await api.get('refresh');
        assign(data);
      } catch (err) {
        token.value = null;
        user.value = null;
        throw err;
      }
    };

    return {
      user,
      token,
      getToken,
      hasUser,
      register,
      login,
      refresh,
    };
  },
  {
    persist: {
      pick: ['token'],
    },
  },
);
