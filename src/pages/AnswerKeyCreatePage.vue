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
import { useQuasar } from 'quasar';
import { skip } from 'src/assets/utils';
import { AnswerKeySetup } from 'src/components';
import { useAnswerKeyStore2 } from 'src/stores/answer-key';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const answerKeyStore = useAnswerKeyStore2();
const loading = ref<boolean>(false);
const router = useRouter();

const startAnalysis = async (): Promise<void> => {
  loading.value = true;

  const result = await answerKeyStore.create();

  loading.value = false;

  if (!result) return;

  $q.dialog({
    title: 'Analyzed!',
    message: 'Answer key has been successfully created. Do you wish to proceed to checking?',
    cancel: true,
    ok: 'Proceed',
  }).onOk(() => {
    router.push({ name: 'Scan Answer Sheets' }).catch(skip);
  });
};
</script>
