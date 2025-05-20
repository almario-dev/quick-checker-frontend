<template>
  <q-page class="px-6 pb-2">
    <AnswerSheetSetup
      v-model="answerSheet.form"
      @submit="answerSheet.quickCheck"
    ></AnswerSheetSetup>
  </q-page>
</template>

<script setup lang="ts">
import { AnswerSheetSetup } from 'src/components';
import { useAnswerSheetStore } from 'src/stores/answer-sheet';
import { onUnmounted } from 'vue';

const answerSheet = useAnswerSheetStore();

onUnmounted(() => {
  answerSheet.resetForm();
});
</script>
