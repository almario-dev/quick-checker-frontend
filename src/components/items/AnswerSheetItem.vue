<template>
  <q-item
    class="bg-white shadow-3 rounded-borders relative q-py-md"
    clickable
    v-ripple
    @click="emit('select', sheet)"
  >
    <div
      v-if="raw && (sheet as AnswerSheetRawResult).status === 'raw'"
      class="absolute bottom-0 right-0 left-0"
    >
      <q-linear-progress indeterminate color="warning" size="xs" />
    </div>

    <q-item-section avatar>
      <q-avatar rounded size="2.8rem">
        <span v-if="checked" class="text-center text-wrap">
          <span class="">{{ score }}</span>
          <small style="font-size: 0.75rem"> / {{ answerKey?.score }} </small>
        </span>

        <q-icon v-else-if="!raw" name="error" color="red-7" />

        <q-spinner-dots v-else color="secondary" size="1.5em" />
      </q-avatar>

      <q-linear-progress
        v-if="checked"
        :value="score / (answerKey?.score ?? 1)"
        color="secondary"
        size="xs"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1" class="font-[500] text-[1rem] flex items-center gap-1">
        <q-icon name="auto_awesome" color="cyan" v-if="!raw && evalSheet.ai_checked" />
        {{ sheet.student_name }}
      </q-item-label>
      <q-item-label lines="2" caption v-if="sheet.answer_key" class="text-grey-8">
        {{ answerKey?.name }}
        ({{ sheet.subject.name }})
      </q-item-label>
      <q-item-label
        lines="1"
        caption
        class="flex gap-2"
        v-if="!raw && !sheet.answer_key && evalSheet.ai_checked"
      >
        <span>{{ sheet.subject.name }} </span>
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-item-label caption class="text-italic text-center">
        <span v-if="!raw">{{ evalSheet.created_at }}</span>
        <span v-else>just now</span>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import {
  type AnswerSheet,
  type AnswerSheetRawResult,
  isChecked,
  isRaw,
} from 'src/stores/answer-sheet-store';
import { computed } from 'vue';
import { type AnswerKey, useAnswerKeyStore } from 'src/stores/answer-key-store';

const props = defineProps<{
  sheet: AnswerSheet | AnswerSheetRawResult;
}>();

const emit = defineEmits<{
  (e: 'select', value: AnswerSheet | AnswerSheetRawResult): void;
}>();

const answerKeyStore = useAnswerKeyStore();

const answerKey = computed(
  () => (props.sheet.answer_key ? answerKeyStore.get(props.sheet.answer_key) : {}) as AnswerKey,
);

const checked = computed(() => isChecked(props.sheet));

const raw = computed(() => isRaw(props.sheet));

const score = computed(() => (props.sheet as AnswerSheet).score ?? 0);

const evalSheet = computed(() => props.sheet as AnswerSheet);
</script>
