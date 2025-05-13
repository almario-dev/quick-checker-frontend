<template>
  <q-item
    class="bg-white shadow-3 rounded-borders relative q-py-md"
    clickable
    v-ripple
    @click="emit('select', sheet)"
  >
    <div v-if="rawSheet.isRaw" class="absolute bottom-0 right-0 left-0">
      <q-linear-progress indeterminate color="warning" size="xs" />
    </div>

    <q-item-section avatar>
      <q-avatar rounded size="2.8rem">
        <q-icon v-if="isFailed" name="error" color="red-7" />

        <!-- template -->
        <span v-else-if="score !== null" class="text-center text-wrap">
          <span class="">{{ score }}</span>
          <small style="font-size: 0.75rem"> / {{ answerKey?.score }} </small>
        </span>

        <q-spinner-dots v-if="rawSheet.isRaw" color="secondary" size="1.5em" />
      </q-avatar>

      <q-linear-progress
        v-if="score !== null"
        :value="(score ?? 0) / (answerKey?.score ?? 1)"
        color="secondary"
        size="xs"
      />
    </q-item-section>

    <q-item-section v-if="answerKey">
      <q-item-label lines="1" class="font-[500] text-[1rem] flex items-center gap-1">
        <q-icon name="auto_awesome" color="cyan" v-if="evalSheet.aiChecked" />
        {{ sheet.studentName }}
      </q-item-label>

      <q-item-label lines="1" caption class="flex gap-2" v-if="sheet.aiChecked">
        <span>{{ sheet.subject?.name }} </span>
      </q-item-label>

      <q-item-label lines="2" caption v-if="sheet.answerKey && sheet.subject" class="text-grey-8">
        {{ answerKey.name }} ({{ sheet.subject.name }})
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-item-label caption class="text-italic text-center">
        <span v-if="evalSheet.createdAt">{{ evalSheet.createdAt }}</span>
        <span v-else>just now</span>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { type AnswerSheet, type AnswerSheetRaw } from 'src/stores/answer-sheet';
import { computed } from 'vue';
import { type AnswerKey, useAnswerKeyStore2 } from 'src/stores/answer-key';

const props = defineProps<{
  sheet: AnswerSheet | AnswerSheetRaw;
}>();

const emit = defineEmits<{
  (e: 'select', value: AnswerSheet | AnswerSheetRaw): void;
}>();

const answerKeyStore = useAnswerKeyStore2();

const answerKey = computed(() => {
  const key = props.sheet.answerKey;

  if (key && typeof key === 'number') {
    return answerKeyStore.getAnswerKey(key);
  }

  return key as AnswerKey;
});

const evalSheet = computed(() => props.sheet as AnswerSheet);

const rawSheet = computed(() => props.sheet as AnswerSheetRaw);

const score = computed(() => evalSheet.value.score);

const isFailed = computed(() => evalSheet.value.score === null && evalSheet.value.evalAt);
</script>
