import { defineStore } from 'pinia';
import { type EvaluationMode } from 'src/composables/dictionary';
import type { Test } from 'src/composables/interfaces/IApp';
import { computed, ref } from 'vue';

export const useCheckerStore = defineStore('checker', () => {
  const test = ref<Test | null>(null);
  const mode = ref<EvaluationMode | null>(null);
  // const answerKeys = ref<Blob

  const getTest = computed(() => test.value);

  const setTest = (arg: Test | null) => {
    test.value = arg;
    mode.value = arg?.mode || null;
  };

  return { test, mode, getTest, setTest };
});
