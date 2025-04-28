<template>
  <router-view />
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useSubjectStore } from './stores/subject-store';
import { useAnswerKeyStore } from './stores/answer-key-store';
import { useAnswerSheetStore } from './stores/answer-sheet-store';
import { useUserStore } from './stores/user-store';

const answerSheetStore = useAnswerSheetStore();
const answerKeyStore = useAnswerKeyStore();
const subjectStore = useSubjectStore();
const userStore = useUserStore();

watch(
  () => userStore.isAuthenticated,
  async (isAuth): Promise<void> => {
    if (!isAuth) return;

    try {
      await Promise.all([
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
</script>
