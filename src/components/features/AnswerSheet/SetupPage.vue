<template>
  <q-page class="bg-white p-6 pb-2">
    <div class="border-dashed border-gray-400 border-2 rounded-lg shadow-5">
      <q-btn color="grey-6" class="full-width full-height" flat @click="scan">
        <div class="column items-center gap-2 py-4">
          <q-img :src="ScanningPng" width="5rem" />
          <span class="text-grey-6 text-weight-medium text-[1rem]">Scan Answer Sheets</span>
        </div>
      </q-btn>
    </div>

    <DocumentsGrid
      class="mt-4"
      v-model:documents="model.documents"
      use-placeholder
      @remove="(d) => emit('remove-document', d)"
    />

    <div class="flex items-center justify-between no-wrap gap-4 mt-6">
      <div class="flex column">
        <span class="text-body text-weight-medium">AI-Based Check</span>
        <span class="text-caption text-grey-7">
          Uses AI to evaluate answers without answer key provided.
        </span>
      </div>
      <q-toggle v-model="model.aiChecked" icon="smart_toy" color="secondary" />
    </div>

    <div class="mb-2 mt-6">
      <Title title="Answer Key Source" dialog />
    </div>

    <q-item v-if="!model.aiChecked" class="q-pl-sm rounded-borders shadow-2" clickable v-ripple>
      <q-item-section avatar class="q-pr-sm">
        <q-avatar v-if="model.answerKey !== null" rounded size="3.5rem" color="grey-11">
          <q-img :src="TestPng" width="50%" />
        </q-avatar>
        <q-avatar v-else rounded size="3.5rem" icon="question_mark" text-color="negative" />
      </q-item-section>

      <q-item-section>
        <template v-if="model.answerKey !== null">
          <q-item-label lines="1" class="font-[500]">
            {{ model.answerKey.name }}
          </q-item-label>
          <q-item-label caption class="flex items-center gap-x-2 flex-wrap">
            Total Points: {{ model.answerKey.score ?? 0 }}
          </q-item-label>
        </template>
        <q-item-label v-else lines="2"> Please select an answer key</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-btn
          label="select"
          size="sm"
          color="blue-grey-7"
          padding="xs 0.7rem"
          unelevated
          @click="answerKeySelectionDialog = true"
        />
      </q-item-section>
    </q-item>

    <div v-else class="column items-center justify-center pt-3 text-grey-7 text-italic">
      <span class="text-[1rem] flex items-center gap-2">
        <q-icon name="smart_toy" />
        AI Inference
      </span>
      <div class="text-center">
        The AI applies general knowledge and reasoning to evaluate answers and assign points without
        using a predefined answer key.
      </div>
    </div>

    <div class="mb-2 mt-6">
      <Title title="Metadata" dialog />
    </div>

    <q-form ref="formRef" class="flex column gap-2" @submit.prevent="submit">
      <q-select
        outlined
        v-model="model.subject"
        :options="subjectStore.getSubjects"
        option-label="name"
        label="Subject"
        lazy-rules
        :rules="createRules({ required: true })"
        @update:model-value="syncSubjects"
      />

      <q-input
        label="Student's Name"
        lazy-rules
        :rules="createRules({ required: true })"
        outlined
        v-model="model.studentName"
      />

      <slot />
    </q-form>
  </q-page>

  <q-footer v-if="!noFooter" reveal class="bg-transparent px-6">
    <div class="my-6">
      <q-btn
        label="Quick Check"
        class="full-width shadow-6"
        padding="0.875rem"
        icon="auto_awesome"
        color="teal-5"
        :loading="loading"
        @click="simulateSubmit"
      />
    </div>
  </q-footer>

  <SelectAnswerKey
    v-model:dialog="answerKeySelectionDialog"
    v-model:answer-key="model.answerKey"
    v-model:subject="model.subject"
  />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { DocumentsGrid, SelectAnswerKey, Title } from 'src/components';
import { ScanningPng, TestPng } from 'src/components/images';
import type { FileType } from 'src/composables/types/app';
import { takePicture } from 'src/composables/useCamera';
import { createRules } from 'src/composables/useRules';
import { type AnswerSheetRaw } from 'src/stores/answer-sheet';
import { useSubjectStore } from 'src/stores/subject-store';
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: AnswerSheetRaw;
    loading?: boolean;
    noFooter?: boolean;
  }>(),
  {
    loading: false,
    noFooter: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: AnswerSheetRaw): void;
  (e: 'remove-document', value: FileType): void;
  (e: 'submit'): void;
}>();

const $q = useQuasar();
const subjectStore = useSubjectStore();

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const answerKeySelectionDialog = ref<boolean>(false);
const formRef = ref<HTMLFormElement | null>(null);

const scan = async (): Promise<void> => {
  const blob = await takePicture();
  model.value.documents.push({ id: Date.now(), blob });
};

const syncSubjects = (): void => {
  const akSubId = model.value.subject?.id || null;
  const subId = model.value.subject?.id || null;

  if (!akSubId || subId) return;

  // answer key subject and the model subject should match
  if (akSubId !== subId) {
    $q.dialog({
      title: 'Change Subject?',
      message: 'Switching subjects will reset your selected answer key. Continue?',
      cancel: 'No',
      ok: 'Yes',
    })
      .onOk(() => {
        model.value.subject = null;
      })
      .onCancel(() => {
        if (!model.value.answerKey?.subject) return;
        model.value.subject = model.value.answerKey?.subject;
      });
  }
};

const submit = (): void => {
  emit('submit');
};

const simulateSubmit = async (): Promise<void> => {
  const valid = await formRef.value?.validate();
  if (valid) {
    submit();
  }
};
</script>
