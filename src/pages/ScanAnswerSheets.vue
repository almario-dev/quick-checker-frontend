<template>
  <q-page class="bg-white p-6 pb-2">
    <div class="border-dashed border-gray-400 border-2 rounded-lg shadow-5">
      <q-btn color="grey-6" class="full-width full-height" flat @click="scan">
        <div class="column items-center gap-2 py-4">
          <q-img src="src/assets/scanning.png" width="5rem" />
          <span class="text-grey-6 text-weight-medium text-[1rem]">Scan Answer Sheets</span>
        </div>
      </q-btn>
    </div>

    <DocumentsGrid
      class="mt-4"
      v-model:documents="scanStore.documents"
      use-placeholder
      @remove="scanStore.removeDocument"
    />

    <div class="flex items-center justify-between no-wrap gap-4 mt-6">
      <div class="flex column">
        <span class="text-body text-weight-medium">AI-Based Check</span>
        <span class="text-caption text-grey-7">
          Uses AI to evaluate answers without answer key provided.
        </span>
      </div>
      <q-toggle v-model="scanStore.aiCheck" icon="smart_toy" color="secondary" />
    </div>

    <div class="mb-2 mt-6">
      <Title title="Answer Key Source" dialog />
    </div>

    <q-item v-if="!scanStore.aiCheck" class="q-pl-sm rounded-borders shadow-2" clickable v-ripple>
      <q-item-section avatar class="q-pr-sm">
        <q-avatar v-if="scanStore.hasAnswerKey" rounded size="3.5rem" color="grey-11">
          <q-img src="src/assets/test.png" width="50%" />
        </q-avatar>
        <q-avatar v-else rounded size="3.5rem" icon="question_mark" text-color="negative" />
      </q-item-section>

      <q-item-section>
        <template v-if="scanStore.hasAnswerKey">
          <q-item-label lines="1" class="font-[500]">
            {{ scanStore.getAnswerKey?.name }}
          </q-item-label>
          <q-item-label caption class="flex items-center gap-x-2 flex-wrap">
            <span> {{ scanStore.getAnswerKey?.subject.name }} </span>
            <q-separator vertical />
            <span>Total Points: {{ scanStore.getAnswerKey?.score ?? 0 }}</span>
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

    <q-form ref="formRef" class="flex column gap-2">
      <q-select
        outlined
        v-model="scanStore.subject"
        :options="subjectStore.getSubjects"
        option-label="name"
        label="Subject"
        lazy-rules
        :rules="createRules({ required: true })"
        @update:model-value="syncSubjects"
      />

      <q-input
        label="Student's Name"
        outlined
        v-model="scanStore.metadata.studentName"
        hint="Enter if not shown in the uploaded documents."
      />
    </q-form>
  </q-page>

  <q-footer reveal class="bg-transparent px-6">
    <div class="my-6">
      <q-btn
        label="Quick Check"
        class="full-width shadow-6"
        padding="0.875rem"
        icon="auto_awesome"
        color="teal-5"
        @click="scanStore.quickCheck"
      />
    </div>
  </q-footer>

  <SelectAnswerKey
    v-model:dialog="answerKeySelectionDialog"
    v-model:answer-key="scanStore.answerKey"
    v-model:subject="scanStore.subject"
  />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { newFileObject } from 'src/assets/utils';
import { DocumentsGrid, SelectAnswerKey, Title } from 'src/components';
import { takePicture } from 'src/composables/useCamera';
import { createRules } from 'src/composables/useRules';
import { useScanStore } from 'src/stores/scan-store';
import { useSubjectStore } from 'src/stores/subject-store';
import { ref } from 'vue';

const $q = useQuasar();
const scanStore = useScanStore();
const subjectStore = useSubjectStore();

const answerKeySelectionDialog = ref<boolean>(false);

const scan = async (): Promise<void> => {
  const file = await takePicture();
  scanStore.documents.push(newFileObject(file));
};

const syncSubjects = (): void => {
  const answerKeySubject = scanStore.getAnswerKey?.subject.id;
  const currentSubject = scanStore.subject?.id || null;

  if (!answerKeySubject || !currentSubject) return; // no answer has been selected yet

  if (answerKeySubject !== currentSubject) {
    $q.dialog({
      title: 'Change Subject?',
      message: 'Switching subjects will reset your selected answer key. Continue?',
      cancel: 'No',
      ok: 'Yes',
    })
      .onOk(() => {
        scanStore.answerKey = null;
      })
      .onCancel(() => {
        if (!scanStore.getAnswerKey?.subject) return;
        scanStore.subject = scanStore.getAnswerKey?.subject;
      });
  }
};
</script>
