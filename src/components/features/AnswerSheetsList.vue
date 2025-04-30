<template>
  <q-list class="q-gutter-y-md" v-bind="$attrs">
    <q-item
      v-for="sheet in paginatedList"
      :key="sheet.id"
      class="bg-white shadow-3 rounded-borders relative q-py-md"
      clickable
      v-ripple
    >
      <div v-if="isRaw(sheet) && sheet.status === 'raw'" class="absolute bottom-0 right-0 left-0">
        <q-linear-progress indeterminate color="warning" size="xs" />
      </div>

      <q-item-section avatar>
        <q-avatar rounded size="2.8rem">
          <span v-if="isChecked(sheet)" class="text-center text-wrap">
            <span class="">89</span>
            <small style="font-size: 0.75rem"> / 100</small>
          </span>

          <q-icon v-else-if="!isRaw(sheet)" name="error" color="red-7" />

          <q-spinner-dots v-else color="secondary" size="1.5em" />
        </q-avatar>

        <q-linear-progress v-if="isChecked(sheet)" :value="0.1" color="secondary" size="xs" />
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1" class="font-[500] text-[1rem] flex items-center gap-1">
          <q-icon name="auto_awesome" color="cyan" v-if="!isRaw(sheet) && sheet.ai_checked" />
          {{ sheet.student_name }}
        </q-item-label>
        <q-item-label lines="2" caption v-if="sheet.answer_key" class="text-grey-8">
          {{ answerKeyStore.get(sheet.answer_key)?.name }}
          ({{ sheet.subject.name }})
        </q-item-label>
        <q-item-label
          lines="1"
          caption
          class="flex gap-2"
          v-if="!isRaw(sheet) && !sheet.answer_key && sheet.ai_checked"
        >
          <span>{{ sheet.subject.name }} </span>
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-item-label caption class="text-italic text-center">
          <span v-if="!isRaw(sheet)">{{ sheet.created_at }}</span>
          <span v-else>just now</span>
        </q-item-label>
      </q-item-section>
    </q-item>
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
</template>

<script setup lang="ts">
import { useAnswerKeyStore } from 'src/stores/answer-key-store';
import {
  type AnswerSheet,
  type AnswerSheetRawResult,
  isChecked,
  isRaw,
} from 'src/stores/answer-sheet-store';
import { computed, ref } from 'vue';

const answerKeyStore = useAnswerKeyStore();

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
</script>
