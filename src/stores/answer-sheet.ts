import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import type { Subject } from 'src/composables/interfaces/IApp';
import { useRequestController } from 'src/composables/useRequestController';
import { api } from 'src/boot/axios';
import { skip } from 'src/assets/utils';
import type { FileType, LocalFileType } from 'src/composables/types/app';
import { type AnswerKey } from './answer-key';
import { useAlertStore } from './alert-store';

export interface AnswerSheet {
  id: number;
  subject: Subject;
  studentName: string;
  answerKey: number;
  aiChecked: boolean;
  score?: number;
  evalAt?: string;
  createdAt?: string;
  documents?: FileType[];
}

export interface AnswerSheetRaw extends Omit<AnswerSheet, 'id' | 'answerKey' | 'subject'> {
  id: string;
  answerKey: AnswerKey | null;
  subject: Subject | null;
  documents: FileType[];
  isRaw: true;
}

export const EmptySheet: AnswerSheetRaw = {
  id: '',
  studentName: '',
  answerKey: null,
  subject: null,
  aiChecked: false,
  documents: [],
  isRaw: true,
};

export const useAnswerSheetStore = defineStore('answer-sheet', () => {
  const { send, runOnce, reset, resetAll, cancelAll } = useRequestController();

  const alert = useAlertStore();

  const list = reactive({
    records: [] as AnswerSheet[],
    pending: [] as AnswerSheetRaw[],
  });

  const form = reactive<AnswerSheetRaw>({
    id: '',
    studentName: '',
    answerKey: null,
    subject: null,
    aiChecked: false,
    documents: [],
    isRaw: true,
  });

  const intervalId = ref<null | NodeJS.Timeout>(null);
  const isActive = ref<boolean>(true);

  const getList = computed(() => [...list.records, ...list.pending].reverse());
  const getRecords = computed(() => list.records);

  const cancelInterval = (): void => {
    if (intervalId.value) {
      clearInterval(intervalId.value);
    }
  };

  // to remove sheet from pending list and transfer to records
  const verifyRaw = (id: string, data: AnswerSheet): void => {
    list.pending = list.pending.filter((i) => i.id !== id);
    list.records.push(data);
  };

  const fetch = async (): Promise<void> => {
    await send('fetch', async (): Promise<void> => {
      try {
        const { data } = await api.get('answer-sheets');
        list.records = data;
      } catch (err) {
        console.error(err);
      }
    });
  };

  const init = async (): Promise<void> => {
    await runOnce('init', async (): Promise<void> => {
      await fetch();

      cancelInterval();

      intervalId.value = setInterval(
        () => {
          if (!isActive.value) return;

          fetch().catch(skip);
        },
        1000 * 60 * 5, // 5 minutes
      );
    });
  };

  const getDocuments = async (id: number): Promise<LocalFileType[] | void> => {
    return await send('get-documents', async (): Promise<LocalFileType[] | void> => {
      const { data } = await api.get(`answer-sheets/${id}/info`);

      if (!data.documents) return;

      return data.documents;
    });
  };

  const resetState = (): void => {
    cancelInterval();
    cancelAll();
    list.records = [];
    list.pending = [];
  };

  const resetForm = () => {
    form.id = '';
    form.studentName = '';
    form.answerKey = null;
    form.subject = null;
    form.aiChecked = false;
    form.documents = [];
  };

  const removeFormDocument = ({ id }: FileType) => {
    form.documents = form.documents.filter((d) => d.id === id);
  };

  const quickCheck = async (): Promise<void> => {
    return await send(
      'quick-check',
      async (): Promise<void> => {
        const showAlert = (message: string): void => {
          alert.Swap({ type: 'warning', message });
        };

        // Validate inputs
        if (!form.documents.length) {
          showAlert('Please upload the appropriate document(s).');
          return;
        }

        if (!form.answerKey && !form.aiChecked) {
          showAlert('Please select the answer key source to proceed.');
          return;
        }

        if (!form.subject) {
          showAlert('Please select the appropriate subject.');
          return;
        }

        const formData = new FormData();
        const formDataFields = [
          { key: 'student_name', value: form.studentName || '' },
          { key: 'subject', value: form.subject.id.toString() },
          { key: 'ai_check', value: form.aiChecked ? '1' : '0' },
        ];

        if (!form.aiChecked && form.answerKey) {
          formDataFields.push({ key: 'answer_key', value: form.answerKey.id.toString() });
        }

        formDataFields.forEach((field) => formData.append(field.key, field.value));

        form.documents.forEach(({ blob }) => {
          if (!blob) return;
          formData.append('documents[]', blob);
        });

        form.id = 'pending_' + Date.now();

        // Add the raw data for immediate feedback
        list.pending.push(form);

        // router.push({ name: 'Recents' }).catch(skip);

        try {
          const { data } = await api.post('scan', formData);
          verifyRaw(form.id, data);
        } catch (error) {
          alert.Swap({
            type: 'error',
            message: 'An error occurred while processing the request.',
          });

          throw error;
        }
      },
      { mode: 'debounce' },
    );
  };

  return {
    list,
    form,
    getRecords,
    getList,
    init,
    fetch,
    getDocuments,
    resetState,
    verifyRaw,
    reset,
    resetAll,
    quickCheck,
    resetForm,
    removeFormDocument,
    cancelAll,
  };
});
