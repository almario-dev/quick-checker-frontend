import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Subject } from 'src/composables/interfaces/IApp';
import { useRequestController } from 'src/composables/useRequestController';
import { api } from 'src/boot/axios';
import { skip } from 'src/assets/utils';

export interface AnswerSheetRawResult {
  id: string;
  answer_key: number | null;
  subject: Subject;
  student_name: string;
  status?: 'raw' | 'failed';
}

export interface AnswerSheet {
  id: number;
  answer_key: number | null;
  subject: Subject;
  student_name: string;
  score: number | null;
  ai_checked: boolean;
  eval_at: string | null;
  created_at: string;
}

// Type guard to check if the object is of type AnswerSheetRawResult
export const isRaw = (sheet: AnswerSheet | AnswerSheetRawResult): sheet is AnswerSheetRawResult => {
  return (sheet as AnswerSheetRawResult).status !== undefined;
};

export const isChecked = (sheet: AnswerSheet | AnswerSheetRawResult): boolean => {
  if (isRaw(sheet)) return false;
  return sheet.score !== null && sheet.eval_at !== null;
};

export const useAnswerSheetStore = defineStore('answer-sheet', () => {
  const { send, runOnce, reset, resetAll, cancelAll } = useRequestController();

  const list = ref<(AnswerSheet | AnswerSheetRawResult)[]>([]);
  const pendingIds = ref<Set<string>>(new Set());

  const getList = computed(() => list.value);

  const addRaw = (data: AnswerSheetRawResult): void => {
    list.value.unshift({ ...data, status: 'raw' });
    pendingIds.value.add(data.id);
  };

  const updateRawSheet = (id: string, data: AnswerSheet | 'failed'): void => {
    pendingIds.value.delete(id);

    list.value = list.value.map((item: AnswerSheetRawResult | AnswerSheet) => {
      if (data === 'failed') {
        return { ...item, status: 'failed' };
      }

      return id === item.id ? data : item;
    });
  };

  const fetch = async (): Promise<void> => {
    await send('fetch', async (): Promise<void> => {
      try {
        const { data } = await api.get('answer-sheets');

        // Filter raw answer sheets (with 'status') and replace the rest with the new data
        list.value = [
          // Keep raw items (those with 'status')
          ...list.value.filter(
            (item: AnswerSheetRawResult | AnswerSheet): item is AnswerSheetRawResult =>
              'status' in item,
          ),
          // Replace the list with the full answer sheets data from the API
          ...data,
        ];
      } catch (err) {
        console.error(err);
      }
    });
  };

  const init = async (): Promise<void> => {
    await runOnce('init', async (): Promise<void> => {
      await fetch();

      setInterval(
        () => {
          fetch().catch(skip);
        },
        1000 * 60 * 5, // 5 minutes
      );
    });
  };

  const resetState = (): void => {
    cancelAll();
    list.value = [];
    pendingIds.value.clear();
  };

  return {
    list,
    getList,
    addRaw,
    updateRawSheet,
    fetch,
    init,
    reset,
    resetAll,
    cancelAll,
    resetState,
  };
});
