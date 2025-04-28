import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Subject } from 'src/composables/interfaces/IApp';

export interface AnswerSheetRawResult {
  id: string;
  answer_key: number;
  subject: Subject;
  student_name: string;
  result: null;
}

export interface AnswerSheet {
  id: number;
  answer_key: number | null;
  subject: number;
  student_name: string;
  score: number | null;
  ai_checked: boolean;
  eval_at: string;
}

export const useAnswerSheetStore = defineStore('answer-sheet', () => {
  const newSessionList = ref<AnswerSheetRawResult[]>([]);

  const list = ref<AnswerSheet[]>([]);

  return {
    list,
    newSessionList,
  };
});
