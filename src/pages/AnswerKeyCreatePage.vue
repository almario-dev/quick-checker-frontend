<template>
  <q-page>
    <AnswerKeySetup
      :loading="loading"
      v-model="answerKeyStore.preparationForm"
      @submit="startAnalysis"
    />
  </q-page>
</template>

<script setup lang="ts">
import { AnswerKeySetup } from 'src/components';
import { useAlertStore } from 'src/stores/alert-store';
import { useAnswerKeyStore2 } from 'src/stores/answer-key';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const alertStore = useAlertStore();
const answerKeyStore = useAnswerKeyStore2();
const loading = ref<boolean>(false);
const router = useRouter();

const startAnalysis = async (): Promise<void> => {
  loading.value = true;

  const result = await answerKeyStore.create();

  loading.value = false;

  if (!result) return;

  answerKeyStore.buffer = result;

  alertStore.Swap({ type: 'positive', message: 'Review analysis data' });

  await router.push({ name: 'Answer Key Details', params: { id: result.id } });
};
</script>
