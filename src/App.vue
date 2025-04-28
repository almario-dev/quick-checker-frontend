<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSubjectStore } from './stores/subject-store';
import { useAuthStore } from './stores/auth-store';
import { useAnswerKeyStore } from './stores/answer-key-store';

const answerKeyStore = useAnswerKeyStore();
const subjectStore = useSubjectStore();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    if (authStore.getToken) {
      await Promise.all([subjectStore.init(), answerKeyStore.fetch()]);
    }
  } catch (error) {
    console.error('Task has failed: ', error);
  }
});
</script>
