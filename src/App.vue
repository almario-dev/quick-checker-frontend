<template>
  <router-view />
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useSubjectStore } from './stores/subject-store';
import { useAnswerSheetStore } from './stores/answer-sheet';
import { useUserStore } from './stores/user-store';
import { App } from '@capacitor/app';
import { useAppStore } from './stores/app';
import { useAnswerKeyStore2 } from './stores/answer-key';

const answerSheetStore = useAnswerSheetStore();
const answerKeyStore = useAnswerKeyStore2();
const subjectStore = useSubjectStore();
const userStore = useUserStore();
const app = useAppStore();

watch(
  () => userStore.isAuthenticated,
  async (isAuth): Promise<void> => {
    if (!isAuth) return;

    try {
      await Promise.allSettled([
        //
        subjectStore.init(),
        answerKeyStore.fetch(),
        answerSheetStore.init(),
      ]);
    } catch (error) {
      console.error('Task has failed: ', error);
    }
  },
);

const onAppStateChange = ({ isActive }: { isActive: boolean }) => {
  app.isActive = isActive;
};

void App.addListener('appStateChange', onAppStateChange);
</script>
