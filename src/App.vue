<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSubjectStore } from './stores/subject-store';
import { useAuthStore } from './stores/auth-store';

const subjectStore = useSubjectStore();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    if (authStore.getToken) {
      await Promise.all([subjectStore.init()]);
    }
  } catch (error) {
    console.error('Task has failed: ', error);
  }
});
</script>
