<template>
  <q-dialog v-model="dialogModel" full-width>
    <q-card>
      <q-card-section v-if="sheet" class="flex justify-center q-py-lg">
        <div class="">
          <q-img :src="ErrorImgSvg" />
        </div>
        <!-- <q-avatar v-else-if="!isRaw(sheet)" rounded size="3rem" font-size="2rem">
          <q-icon name="priority_high" color="red-7" />
        </q-avatar> -->
      </q-card-section>

      <q-card-section class="scroll column gap-4" style="max-height: 60vh">
        <q-input :model-value="sheetModel?.student_name" label="Student's Name" />
        <q-input :model-value="sheetModel?.subject.name" label="Subject" />
        <q-input v-if="answerKey" :model-value="answerKey.name" label="Answer Key">
          <template v-slot:append>
            <div class="full-height flex items-center text-[0.9rem]">
              {{ answerKey.score || 0 }} Points
            </div>
          </template>
        </q-input>

        <div>
          <Title title="Documents" dialog class="mb-2" />
          <DocumentsGrid v-model:documents="documents" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { DocumentsGrid, Title } from '..';
import {
  useAnswerSheetStore,
  type AnswerSheet,
  type AnswerSheetRawResult,
} from 'src/stores/answer-sheet-store';
import { useAnswerKeyStore } from 'src/stores/answer-key-store';
import type { LocalFileType } from 'src/composables/types/app';
import { ErrorImgSvg } from '../images';

const answerKeyStore = useAnswerKeyStore();
const answerSheetStore = useAnswerSheetStore();

const props = withDefaults(
  defineProps<{
    dialog: boolean;
    sheet: AnswerSheet | AnswerSheetRawResult | null;
  }>(),
  {
    sheet: null,
    dialog: false,
  },
);

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void;
  (e: 'update:sheet', value: AnswerSheet | AnswerSheetRawResult | null): void;
}>();

const documents = ref<LocalFileType[]>([]);

const dialogModel = computed({
  get: () => props.dialog,
  set: (v) => emit('update:dialog', v),
});

const sheetModel = computed({
  get: () => props.sheet,
  set: (v) => emit('update:sheet', v),
});

const answerKey = computed(() => answerKeyStore.get(props.sheet?.answer_key || 0) ?? null);

watch(
  () => props.sheet,
  async (sheet: AnswerSheet | AnswerSheetRawResult | null): Promise<void> => {
    if (!sheet || typeof sheet.id !== 'number') return;

    try {
      const docs = await answerSheetStore.getDocuments(sheet.id);

      documents.value = docs || [];
    } catch (err) {
      console.error(err);
    }
  },
);
</script>
