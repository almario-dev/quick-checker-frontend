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

  <ViewSheet v-model:dialog="viewSheetProps.dialog" v-model:sheet="viewSheetProps.sheet" />
</template>

<script setup lang="ts">
import { type AnswerSheet, type AnswerSheetRawResult } from 'src/stores/answer-sheet-store';
import { computed, ref } from 'vue';
import { SheetItem, ViewSheet } from '..';

const props = withDefaults(
  defineProps<{
    displayOnly?: number;
    perPage?: number;
    noPagination?: boolean;
    list: (AnswerSheet | AnswerSheetRawResult)[];
    search?: string | number | null;
  }>(),
  {
    perPage: 15,
    noPagination: false,
  },
);

const emit = defineEmits<{
  (e: 'update:list', value: (AnswerSheet | AnswerSheetRawResult)[]): void;
  (e: 'update:search', value: string | number | null): void;
}>();

const page = ref(1);
const viewSheetProps = ref({
  dialog: false as boolean,
  sheet: null as AnswerSheet | AnswerSheetRawResult | null,
});

const listModel = computed({
  get: () => props.list,
  set: (v) => emit('update:list', v),
});

const searchModel = computed({
  get: () => props.search ?? null,
  set: (v) => emit('update:search', v),
});

const computedList = computed<(AnswerSheet | AnswerSheetRawResult)[]>(() => {
  if (!searchModel.value) return listModel.value;

  const searchTerm = searchModel.value.toString().toLowerCase();

  return listModel.value.filter((item) => {
    const studentName = 'student_name' in item ? item.student_name.toLowerCase() : '';
    const subjectName =
      'subject' in item && typeof item.subject === 'object' ? item.subject.name.toLowerCase() : '';

    return studentName.includes(searchTerm) || subjectName.includes(searchTerm);
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

const viewAnswerSheet = (sheet: AnswerSheetRawResult | AnswerSheet): void => {
  viewSheetProps.value.sheet = sheet;
  viewSheetProps.value.dialog = true;
};
</script>
