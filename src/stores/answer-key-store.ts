import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Subject } from 'src/composables/interfaces/IApp';
import type { LocalFileType } from 'src/composables/types/app';
import { useRequestController } from 'src/composables/useRequestController';
import { computed, reactive, ref } from 'vue';
import { useAlertStore } from './alert-store';
import { AxiosError } from 'axios';
import { getErrMessage } from 'src/assets/utils';

export type AnswerKeyMode = 'ENFORCE_KEY' | 'USE_QUESTIONNAIRE';

export interface AnswerKeyRawData {
  name: string;
  subject: Subject | null;
  useQuestionnaire: boolean;
  attachments: LocalFileType[] | null;
}

export interface AnswerKeyBasic {
  id: number;
  subject: Subject;
  mode: AnswerKeyMode;
  score: null | number;
}

export const useAnswerKeyStore = defineStore('answer-key', () => {
  const { send } = useRequestController();
  const alertStore = useAlertStore();

  const answerKeys = ref<AnswerKeyBasic[]>([]);
  const usedKeyId = ref<number | null>(null);

  const newModel = reactive<AnswerKeyRawData>({
    name: '',
    subject: null,
    useQuestionnaire: false,
    attachments: [],
  });

  const getList = computed(() => answerKeys.value);
  const getUsedAnswerKey = computed(() =>
    answerKeys.value.find((a: AnswerKeyBasic) => a.id === usedKeyId.value),
  );

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

  const create = async (): Promise<AnswerKeyBasic | void> => {
    return await send(
      'create',
      async (): Promise<AnswerKeyBasic | void> => {
        try {
          // const formData = new FormData();
          const form = getNewModelData.value;

          if (!form) return;

          const { data } = await api.post('answer-keys', form);

          answerKeys.value.push(data);

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

  return {
    answerKeys,
    usedKeyId,
    newModel,
    getList,
    getUsedAnswerKey,
    create,
    removeAttachment,
  };
});
