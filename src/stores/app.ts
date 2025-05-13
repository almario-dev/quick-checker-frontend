import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAnswerKeyStore2 } from './answer-key';

export const useAppStore = defineStore('app', () => {
  const router = useRouter();
  const answerKeyStore = useAnswerKeyStore2();

  const isActive = ref<boolean>(true);

  const scanNow = async (): Promise<void> => {
    console.log(answerKeyStore.getAnswerKeys.length);

    await router.push({
      name: answerKeyStore.getAnswerKeys.length ? 'Scan Answer Sheets' : 'Create Answer Key',
    });
  };

  return {
    isActive,
    scanNow,
  };
});
