<template>
  <q-list class="q-gutter-y-md" v-bind="$attrs">
    <SheetItem
      v-for="sheet in paginatedList"
      :key="sheet.id"
      :sheet="sheet"
      @select="viewAnswerSheet"
    />
  </q-list>

  <div class="flex justify-center q-mt-md" v-if="computedList.length > (perPage ?? 15)">
    <q-pagination
      v-if="!noPagination"
      v-model="page"
      :max="maxPage"
      :max-pages="5"
      boundary-numbers
      size="0.75rem"
      color="grey-7"
    />
  </div>

  <ViewSheet
    v-model:dialog="viewSheetProps.dialog"
    @hide="viewSheetProps.sheet = EmptySheet"
    v-model:sheet="viewSheetProps.sheet"
  />
</template>

<script setup lang="ts">
import {
  EmptySheet,
  useAnswerSheetStore,
  type AnswerSheetRaw,
  type AnswerSheet,
} from 'src/stores/answer-sheet';
import { computed, ref } from 'vue';
import { SheetItem, ViewSheet } from '../..';
import { useAnswerKeyStore2 } from 'src/stores/answer-key';

const store = useAnswerSheetStore();
const answerKeyStore = useAnswerKeyStore2();

const props = withDefaults(
  defineProps<{
    displayOnly?: number;
    perPage?: number;
    noPagination?: boolean;
    search?: string | number | null;
  }>(),
  {
    perPage: 15,
    noPagination: false,
  },
);

const emit = defineEmits<{
  (e: 'update:search', value: string | number | null): void;
}>();

const page = ref(1);
const viewSheetProps = ref({
  dialog: false as boolean,
  sheet: EmptySheet as AnswerSheet | AnswerSheetRaw,
});
const searchModel = computed({
  get: () => props.search ?? null,
  set: (v) => emit('update:search', v),
});

const computedList = computed(() => {
  const list = [...store.getRecords, ...store.list.pending];
  const term = searchModel.value?.toString().toLowerCase();

  if (!term) return list;

  return list.filter(({ answerKey, subject, studentName }) => {
    const student = studentName.toLowerCase();
    const subjectName = subject?.name?.toLowerCase() || '';
    const akName =
      typeof answerKey === 'number'
        ? answerKeyStore.getAnswerKey(answerKey)?.name?.toLowerCase() || ''
        : answerKey?.name?.toLowerCase() || '';

    return student.includes(term) || subjectName.includes(term) || akName.includes(term);
  });
});

const maxPage = computed(() => Math.ceil(computedList.value.length / props.perPage));

const paginatedList = computed(() => {
  if (props.noPagination && !props.displayOnly) {
    return computedList.value;
  } else if (props.noPagination) {
    return computedList.value.slice(0, props.displayOnly);
  }

  const start = (page.value - 1) * props.perPage;
  const end = start + props.perPage;
  return computedList.value.slice(start, end);
});

const viewAnswerSheet = (sheet: AnswerSheet | AnswerSheetRaw): void => {
  viewSheetProps.value.sheet = sheet;
  viewSheetProps.value.dialog = true;
};
</script>
