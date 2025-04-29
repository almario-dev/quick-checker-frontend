import { defineStore } from 'pinia';
import type { UserData } from 'src/composables/types/auth';
import { useRequestController } from 'src/composables/useRequestController';
import { computed, ref } from 'vue';
import { useAlertStore } from './alert-store';
import { api } from 'src/boot/axios';
import type { ChangePassword } from 'src/composables/interfaces/IApp';
import { skip } from 'src/assets/utils';

export const useUserStore = defineStore('user', () => {
  const { send, cancelAll } = useRequestController();
  const alertStore = useAlertStore();

  const data = ref<UserData>(null);

  const getData = computed((): UserData => data.value);

  const isAuthenticated = computed((): boolean => data.value !== null);

  const setData = (newData: UserData) => {
    data.value = newData;
  };

  const changeName = async (name: string): Promise<void> => {
    await send(
      'change-name',
      async (): Promise<void> => {
        try {
          await api.post('user/change-name', { name });
          alertStore.Swap({ type: 'positive', message: 'Account name has been changed.' });

          if (data.value) {
            data.value.name = name;
          }
        } catch (err) {
          alertStore.Swap({
            type: 'negative',
            message: 'Unable to save changes. Please try again later.',
          });

          throw err;
        }
      },
      { mode: 'latest' },
    );
  };

  const changePassword = async (data: ChangePassword): Promise<void> => {
    await send(
      'change-password',
      async (): Promise<void> => {
        try {
          await api.post('user/change-password', data);

          alertStore.Swap({ type: 'positive', message: 'Password has been successfully updated.' });
        } finally {
          skip();
        }
      },
      { mode: 'debounce' },
    );
  };

  return {
    data,
    getData,
    isAuthenticated,
    setData,
    changeName,
    changePassword,
    cancelAll,
  };
});
