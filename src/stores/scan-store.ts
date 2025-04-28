import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { type AnswerKey, useAnswerKeyStore } from './answer-key-store';
import type { LocalFileType } from 'src/composables/types/app';
import type { Subject } from 'src/composables/interfaces/IApp';
import { useRouter } from 'vue-router';
import { useRequestController } from 'src/composables/useRequestController';
import { useAlertStore } from './alert-store';
import { api } from 'src/boot/axios';
import { useAnswerSheetStore } from './answer-sheet-store';
import { skip } from 'src/assets/utils';

export const useScanStore = defineStore('scan', () => {
  const { send, cancelAll } = useRequestController();

  const router = useRouter();
  const alertStore = useAlertStore();
  const answerKeyStore = useAnswerKeyStore();
  const answerSheetStore = useAnswerSheetStore();

  const answerKey = ref<AnswerKey | null>(null);
  const documents = ref<LocalFileType[]>([]);
  const aiCheck = ref<boolean>(false);
  const metadata = reactive({ studentName: null as string | null });
  const subject = ref<Subject | null>(null);
  const createThenScan = ref<boolean>(false);

  const getAnswerKey = computed(() => answerKey.value);
  const hasAnswerKey = computed(() => answerKey.value !== null);

  const useAnswerKey = (key: AnswerKey): void => {
    answerKey.value = key;
  };

  const scanNow = async (): Promise<void> => {
    await router.push({
      name: answerKeyStore.getList.length ? 'Scan Answer Sheets' : 'Create Answer Key',
    });
  };

  const removeDocument = (id: string | number): void => {
    documents.value = documents.value.filter((f: LocalFileType) => f.id !== id);
  };

  const quickCheck = async (): Promise<void> => {
    return await send(
      'quick-check',
      async (): Promise<void> => {
        const showAlert = (message: string): void => {
          alertStore.Swap({ type: 'warning', message });
        };

        // Validate inputs
        if (!documents.value.length) {
          showAlert('Please upload the appropriate document(s).');
          return;
        }

        if (!answerKey.value && !aiCheck.value) {
          showAlert('Please select the answer key source to proceed.');
          return;
        }

        if (!subject.value) {
          showAlert('Please select the appropriate subject.');
          return;
        }

        const formData = new FormData();
        const formDataFields = [
          { key: 'student_name', value: metadata.studentName || '' },
          { key: 'subject', value: subject.value.id.toString() },
          { key: 'ai_check', value: aiCheck.value ? '1' : '0' },
        ];

        if (!aiCheck.value && answerKey.value) {
          formDataFields.push({ key: 'answer_key', value: answerKey.value.id.toString() });
        }

        formDataFields.forEach((field) => formData.append(field.key, field.value));

        documents.value.forEach((file: LocalFileType) => {
          formData.append('documents[]', file.file);
        });

        const tempId = 'as' + Date.now();

        // Add the raw data for immediate feedback
        answerSheetStore.addRaw({
          id: tempId,
          answer_key: answerKey.value?.id || 0,
          subject: subject.value,
          student_name: metadata.studentName || '',
        });

        router.push({ name: 'Recents' }).catch(skip);

        try {
          const { data } = await api.post('scan', formData);
          answerSheetStore.updateRawSheet(tempId, data);
        } catch (error) {
          alertStore.Swap({
            type: 'error',
            message: 'An error occurred while processing the request.',
          });

          throw error;
        }
      },
      { mode: 'debounce' },
    );
  };

  const resetForm = (): void => {
    answerKey.value = null;
    documents.value = [];
    aiCheck.value = false;
    metadata.studentName = null;
    subject.value = null;
  };

  const resetState = (): void => {
    cancelAll();
    resetForm();
  };

  return {
    answerKey,
    getAnswerKey,
    documents,
    aiCheck,
    metadata,
    subject,
    hasAnswerKey,
    createThenScan,
    useAnswerKey,
    scanNow,
    quickCheck,
    removeDocument,
    cancelAll,
    resetState,
    resetForm,
  };
});
