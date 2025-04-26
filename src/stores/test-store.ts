import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import type { Test } from 'src/composables/interfaces/IApp';
import { computed, ref } from 'vue';
import { useAlertStore } from './alert-store';
import { getErrMessage } from 'src/assets/utils';
import { api } from 'src/boot/axios';
import { useRequestController } from 'src/composables/useRequestController';

export const useTestStore = defineStore('test', () => {
  const alertStore = useAlertStore();

  const { send, runOnce } = useRequestController();

  const tests = ref<Test[]>([]);

  const all = computed(() => tests.value);

  const fetch = async (): Promise<void> => {
    try {
      await send('fetch', async (): Promise<void> => {
        const { data } = await api.get('tests');

        tests.value = data;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const init = async (): Promise<void> => {
    await runOnce('init', fetch);
  };

  const create = async (name: string, subject: number): Promise<Test> => {
    try {
      const { data } = await api.post('tests', { name, subject });
      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        alertStore.Swap({
          type: 'negative',
          message: getErrMessage(err),
        });
      }

      throw err;
    }
  };

  return { tests, all, create, fetch, init };
});
