import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { type AnswerKey, useAnswerKeyStore } from './answer-key-store';
import type { LocalFileType } from 'src/composables/types/app';
import type { Subject } from 'src/composables/interfaces/IApp';
import { useRouter } from 'vue-router';
import { useRequestController } from 'src/composables/useRequestController';
import { useAlertStore } from './alert-store';
import { api } from 'src/boot/axios';

export const useScanStore = defineStore('scan', () => {
  const { send } = useRequestController();

  const router = useRouter();
  const alertStore = useAlertStore();
  const answerKeyStore = useAnswerKeyStore();

  const answerKey = ref<AnswerKey | null>(null);
  const documents = ref<LocalFileType[]>([]);
  const aiCheck = ref<boolean>(false);
  const metadata = reactive({
    studentName: null as string | null,
  });
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
        if (!documents.value.length) {
          alertStore.Swap({
            type: 'warning',
            message: 'Please upload the appropriate document(s).',
          });

          return;
        }

        if (!answerKey.value) {
          alertStore.Swap({
            type: 'warning',
            message: 'Please select the answer key source to proceed.',
          });
          return;
        }

        if (!subject.value) {
          alertStore.Swap({ type: 'warning', message: 'Please select the appropriate subject.' });
          return;
        }

        const form = new FormData();
        form.append('student_name', metadata.studentName || '');
        form.append('subject', subject.value.id.toString());
        form.append('answer_key', answerKey.value.id.toString());
        form.append('ai_check', aiCheck.value ? '1' : '0');

        documents.value.forEach((file: LocalFileType) => {
          form.append('documents[]', file.file);
        });

        const { data } = await api.post('scan', form);

        console.log(data);
      },
      { mode: 'debounce' },
    );
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
  };
});
