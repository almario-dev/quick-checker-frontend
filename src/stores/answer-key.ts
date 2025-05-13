import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Context, Subject } from 'src/composables/interfaces/IApp';
import type { FileType } from 'src/composables/types/app';
import { useRequestController } from 'src/composables/useRequestController';
import { computed, reactive, ref } from 'vue';
import { useAlertStore } from './alert-store';
import { AxiosError } from 'axios';
import { getErrMessage } from 'src/assets/utils';
import { EmptySubject } from './subject-store';

export interface AnswerKey {
  id: number;
  name: string;
  subject: Subject;
  useQuestionnaire: boolean;
  isRaw?: boolean;
  evalAt?: string;
  context?: Context;
  mode?: string;
  score?: number;
  scans?: number;
  documents?: FileType[];
}

export interface AnswerKeyForm extends Omit<AnswerKey, 'subject' | 'id'> {
  subject: Subject | null;
  documents: FileType[];
}

export const EmptyKey: AnswerKey = {
  id: 0,
  name: '',
  subject: EmptySubject,
  useQuestionnaire: false,
  documents: [],
};

export const useAnswerKeyStore2 = defineStore('answer-key-2', () => {
  const { send, cancel, cancelAll } = useRequestController();
  const alertStore = useAlertStore();

  const list = ref([] as AnswerKey[]);
  const buffer = ref<AnswerKey | null>(null);

  const getAnswerKeys = computed(() => list.value);

  const preparationForm = reactive<AnswerKeyForm>({
    name: '',
    subject: null,
    useQuestionnaire: false,
    documents: [],
  });

  const getAnswerKey = (id: number) => {
    return getAnswerKeys.value.find((a) => a.id === id);
  };

  const resetPreparationForm = () => {
    preparationForm.name = '';
    preparationForm.subject = null;
    preparationForm.useQuestionnaire = false;
    preparationForm.documents = [];
  };

  const removePreparationDocument = ({ id }: FileType) => {
    preparationForm.documents = preparationForm.documents.filter((d) => d.id === id);
  };

  const fetch = async (): Promise<void> => {
    await send(
      'fetch',
      async (): Promise<void> => {
        const { data } = await api.get('answer-keys');
        list.value = data;
      },
      { mode: 'debounce' },
    );
  };

  const fetchFullDetails = async (id: number): Promise<AnswerKey | void> => {
    return await send(
      'fetch-full-details',
      async (): Promise<AnswerKey | void> => {
        const { data } = await api.get(`answer-keys/${id}/full-details`);
        return data;
      },
      { mode: 'debounce' },
    );
  };

  const create = async (): Promise<AnswerKey | void> => {
    return await send(
      'create',
      async (): Promise<AnswerKey | void> => {
        try {
          const { name, subject, useQuestionnaire, documents } = preparationForm;

          if (!subject || !name) return;

          const form = new FormData();

          form.append('name', name ?? '');
          form.append('subject', subject.id?.toString() ?? '');
          form.append('useQuestionnaire', useQuestionnaire ? '1' : '0');

          // Attachments (optional)
          documents.forEach(({ blob }: FileType) => {
            if (!blob) return;
            form.append('attachments[]', blob);
          });

          const { data } = await api.post('answer-keys', form);

          list.value.push(data.basic);

          return data.full;
        } catch (err) {
          if (err instanceof AxiosError) {
            alertStore.Swap({
              type: 'negative',
              message: getErrMessage(err, 'Unable to generate answer key data.'),
            });
          }

          throw err;
        }
      },
      { mode: 'debounce' },
    );
  };

  const archive = async (id: number): Promise<void> => {
    await send('archive', async (): Promise<void> => {
      await api.delete('answer-keys/' + id);
      list.value = list.value.filter((i) => i.id !== id);
      alertStore.Swap({ type: 'info', message: 'Answer key has been removed.' });
    });
  };

  const reanalyze = async (id: string | number): Promise<AnswerKey | void> => {
    return await send(
      'reanalyze',
      async (): Promise<AnswerKey | void> => {
        try {
          const { data } = await api.put('answer-keys/' + id);

          // update list
          list.value = list.value.map((i) => (i.id == id ? { ...i, ...data } : i));

          return data;
        } catch (err) {
          console.error(err);

          if (err instanceof AxiosError) {
            alertStore.Swap({
              type: 'negative',
              message: getErrMessage(err, 'An error  has occured'),
            });
          }

          throw err;
        }
      },
      { mode: 'debounce' },
    );
  };

  const update = async (
    updatedData: AnswerKeyForm,
    id: string | number,
  ): Promise<AnswerKey | void> => {
    try {
      const { name, subject, documents, context } = updatedData;

      if (!subject || !name || !context) return;

      if (!documents.length) {
        alertStore.Swap({
          type: 'negative',
          message: 'Missing document(s)',
        });
        return;
      }

      const form = new FormData();

      // get the total points
      context.total_points = context.tests.reduce(
        (total, test) => total + (Number(test.max_points) || 0),
        0,
      );

      form.append('name', name ?? '');
      form.append('subject', subject.id?.toString() ?? '');
      form.append('context', JSON.stringify(context));

      // Attachments (optional)
      documents.forEach(({ blob, path, id }: FileType) => {
        if (blob) form.append('attachments[]', blob);
        if (path) form.append('existing_paths[]', String(id));
      });

      const { data } = await api.post('answer-keys/' + id, form);

      // update list
      list.value = list.value.map((i) => (i.id == id ? data.basic : i));

      return data.full;
    } catch (err) {
      if (err instanceof AxiosError) {
        alertStore.Swap({
          type: 'negative',
          message: getErrMessage(err, 'Unable to save changes.'),
        });
      }

      throw err;
    }
  };

  return {
    list,
    getAnswerKeys,
    preparationForm,
    buffer,
    resetPreparationForm,
    removePreparationDocument,
    fetch,
    fetchFullDetails,
    getAnswerKey,
    create,
    archive,
    reanalyze,
    update,
    cancel,
    cancelAll,
  };
});
