import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Subject } from 'src/composables/interfaces/IApp';
import type { LocalFileType } from 'src/composables/types/app';
import { useRequestController } from 'src/composables/useRequestController';
import { computed, reactive, ref } from 'vue';
import { useAlertStore } from './alert-store';
import { AxiosError } from 'axios';
import { getErrMessage, skip } from 'src/assets/utils';

export type AnswerKeyMode = 'ENFORCE_KEY' | 'USE_QUESTIONNAIRE';

export interface AnswerKeyRawData {
  name: string;
  subject: Subject | null;
  useQuestionnaire: boolean;
  attachments: LocalFileType[] | null;
}

export interface AnswerKeyMinimal {
  id: number;
  name: string;
  score: null | number;
}

export interface AnswerKeyBasic {
  id: number;
  name: string;
  subject: Subject;
  mode: AnswerKeyMode;
  score: null | number;
}

export interface AnswerKey {
  id: number;
  name: string;
  subject: Subject;
  mode: AnswerKeyMode;
  score: null | number;
  context: string | null;
  eval_at: string | null;
  metadata: Record<string, unknown> | null;
  snapshots: LocalFileType[];
}

export interface AnswerKeyResultSet {
  basic: AnswerKeyBasic;
  full: AnswerKey;
}

export const useAnswerKeyStore = defineStore('answer-key', () => {
  const { send } = useRequestController();
  const alertStore = useAlertStore();

  const answerKeys = ref<AnswerKeyBasic[]>([]);

  const newModel = reactive<AnswerKeyRawData>({
    name: '',
    subject: null,
    useQuestionnaire: false,
    attachments: [],
  });

  const getList = computed(() => answerKeys.value);

  const getNewModelData = computed(() => {
    const { name, subject, useQuestionnaire, attachments } = newModel;

    if (!subject) return null;

    const form = new FormData();

    form.append('name', name ?? '');
    form.append('subject', subject.id?.toString() ?? '');
    form.append('useQuestionnaire', useQuestionnaire ? '1' : '0');

    // Attachments (optional)
    attachments?.forEach((file: LocalFileType) => {
      form.append('attachments[]', file.file);
    });

    return form;
  });

  const removeAttachment = (id: string): void => {
    newModel.attachments = (newModel.attachments ?? []).filter((f: LocalFileType) => f.id !== id);
  };

  const resetModel = (): void => {
    newModel.name = '';
    newModel.attachments = [];
    newModel.subject = null;
    newModel.useQuestionnaire = false;
  };

  const create = async (): Promise<AnswerKeyResultSet | void> => {
    return await send(
      'create',
      async (): Promise<AnswerKeyResultSet | void> => {
        try {
          const form = getNewModelData.value;

          if (!form) return;

          const { data } = await api.post('answer-keys', form);

          answerKeys.value.push(data.basic);

          return data;
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

  const fetch = async (): Promise<void> => {
    await send(
      'fetch',
      async (): Promise<void> => {
        try {
          const { data } = await api.get('answer-keys');
          answerKeys.value = data;
        } finally {
          skip();
        }
      },
      { mode: 'debounce' },
    );
  };

  const archive = async (id: number): Promise<void> => {
    await send('archive', async (): Promise<void> => {
      await api.delete('answer-keys/' + id);
      alertStore.Swap({ type: 'info', message: 'Answer key has been removed.' });
    });
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

  return {
    answerKeys,
    newModel,
    getList,
    create,
    removeAttachment,
    fetch,
    archive,
    resetModel,
    fetchFullDetails,
  };
});
