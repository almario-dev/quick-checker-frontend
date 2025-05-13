import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Subject } from 'src/composables/interfaces/IApp';
import { computed, ref } from 'vue';
import { useAlertStore } from './alert-store';
import { AxiosError } from 'axios';
import { getErrMessage } from 'src/assets/utils';
import { useRequestController } from 'src/composables/useRequestController';

export const FETCH_IN_PROGRESS = 1;

export const EmptySubject: Subject = {
  id: 0,
  name: '',
};

export const useSubjectStore = defineStore('subject', () => {
  const alertStore = useAlertStore();

  const subjects = ref<Subject[]>([]);
  const hasFetched = ref<boolean>(false);

  const getSubjects = computed(() => subjects.value);

  const { send, runOnce, reset, resetAll, cancelAll } = useRequestController();

  const fetch = async (): Promise<void> => {
    await send(
      'fetch',
      async (): Promise<void> => {
        try {
          hasFetched.value = true;
          const { data } = await api.get('subjects');
          subjects.value = data;
        } catch {
          if (hasFetched.value) {
            hasFetched.value = false; // reset
          }
        }
      },
      { mode: 'debounce' },
    );
  };

  const init = async (): Promise<void> => {
    // if (hasFetched.value) return; // can only initialize once
    await runOnce('init', fetch);
  };

  const archive = async (id: number): Promise<void> => {
    await send('archive', async () => {
      try {
        await api.delete(`subjects/${id}`);
        alertStore.Swap({ type: 'info', message: 'Subject has been deleted.' });
      } catch (err) {
        if (err instanceof AxiosError) {
          alertStore.Swap({
            type: 'negative',
            message: getErrMessage(err, 'Something went wrong'),
          });
        }
        throw err; // still throw to let send handle it or log it
      }
    });
  };

  const create = async (name: string): Promise<void> => {
    await send('create', async (): Promise<void> => {
      try {
        await api.post('subjects', { name });
        alertStore.Swap({ type: 'positive', message: 'A new subject has been added.' });
      } catch (err) {
        if (err instanceof AxiosError) {
          alertStore.Swap({
            type: 'negative',
            message: getErrMessage(err, 'Unable to add new subject. Please try again.'),
          });
        }

        throw err;
      }
    });
  };

  const update = async (id: number, name: string): Promise<void> => {
    await send('update', async (): Promise<void> => {
      try {
        await api.put('subjects/' + id, { name });

        alertStore.Swap({ type: 'positive', message: 'Updated successfully.' });
      } catch (err) {
        if (err instanceof AxiosError) {
          alertStore.Swap({
            type: 'negative',
            message: getErrMessage(err, 'Unable to save changes. Please try again.'),
          });
        }

        throw err;
      }
    });
  };

  const resetState = (): void => {
    cancelAll();
    subjects.value = [];
  };

  return {
    subjects,
    getSubjects,
    hasFetched,
    fetch,
    archive,
    create,
    update,
    init,
    reset,
    resetAll,
    cancelAll,
    resetState,
  };
});
