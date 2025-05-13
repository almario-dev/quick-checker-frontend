<template>
  <div class="column items-center mt-6 gap-6 mb-6">
    <template v-if="mode === 'create'">
      <q-img :src="AddFilesSvg" style="max-width: 45%" />
      <h6 class="text-blue-grey-8 text-weight-regular">Create Answer Key</h6>
    </template>
    <template v-else>
      <slot name="header">
        <h6 class="text-blue-grey-8 text-weight-regular">Answer Key Details</h6>
      </slot>
    </template>
  </div>

  <div class="bg-white p-6 pb-2 grow">
    <div class="flex items-center justify-between no-wrap gap-4 mb-4">
      <div class="flex column">
        <span class="text-body text-weight-medium">Use Questionnaire</span>
        <span class="text-caption text-grey-7">
          Upload the test questionnaire only. AI will extract answers automatically.
        </span>
      </div>
      <span v-if="mode !== 'create'" class="font-bold text-grey-9">Off</span>
      <q-toggle v-else v-model="model.useQuestionnaire" icon="fact_check" color="secondary" />
    </div>

    <div class="mb-2">
      <Title
        :title="`${mode === 'edit' ? 'Documents' : 'Files Uploaded'} (${model?.documents?.length || 0})`"
        dialog
      />
    </div>

    <DocumentsGrid
      :loading="!!loading"
      v-model:documents="model.documents"
      @remove="removeDocument"
    >
      <template v-slot:after>
        <div class="border-dashed border-gray-400 border-2 rounded-lg shadow-3 h-[5rem]">
          <q-btn
            :disable="loading"
            color="grey-6"
            class="full-width full-height"
            flat
            @click="scan"
          >
            <div class="flex column items-center justify-center">
              <q-img :src="CameraPng" width="2rem" />
              <small>scan</small>
            </div>
          </q-btn>
        </div>
      </template>
    </DocumentsGrid>

    <q-form ref="formRef" class="flex column gap-1" @submit.prevent="onSubmit">
      <div class="mb-1 mt-6">
        <Title :title="mode === 'edit' ? 'Basic Info' : 'Fill up basic info'" dialog />
      </div>
      <q-input
        label="Name"
        outlined
        v-model="model.name"
        lazy-rules
        :rules="createRules({ required: true })"
      />
      <q-select
        outlined
        v-model="model.subject"
        :options="subjectStore.getSubjects"
        option-label="name"
        label="Subject"
        lazy-rules
        :rules="createRules({ required: true })"
      />
      <slot :onClick="emitSubmit" :loading="loading" />
    </q-form>
  </div>

  <q-footer v-if="!noFooter" reveal class="bg-white px-6">
    <div class="my-6">
      <slot name="button" :onClick="emitSubmit" :loading="loading">
        <q-btn
          class="full-width shadow-6"
          icon="auto_awesome"
          padding="0.875rem"
          :loading="loading"
          :disable="loading"
          v-bind="submitBtn"
          @click="emitSubmit"
        />
      </slot>
    </div>
  </q-footer>

  <Preview v-model:dialog="previewModel.dialog" v-model:snapshot="previewModel.image" />
</template>

<script setup lang="ts">
import { DocumentsGrid, Preview, Title } from 'src/components';
import { AddFilesSvg, CameraPng } from 'src/components/images';
import type { FileType } from 'src/composables/types/app';
import { takePicture } from 'src/composables/useCamera';
import { createRules } from 'src/composables/useRules';
import { useAnswerKeyStore2, type AnswerKeyForm } from 'src/stores/answer-key';
import { useSubjectStore } from 'src/stores/subject-store';
import { computed, onUnmounted, reactive, ref } from 'vue';

const subjectStore = useSubjectStore();
const answerKey = useAnswerKeyStore2();

const props = withDefaults(
  defineProps<{
    modelValue: AnswerKeyForm;
    mode?: 'edit' | 'create';
    submitBtn?: Record<string, string>;
    loading?: boolean;
    noFooter?: boolean;
  }>(),
  {
    submitBtn: () => ({
      color: 'teal',
      label: 'Start Analysis',
    }),
    loading: false,
    mode: 'create',
    noFooter: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: AnswerKeyForm): void;
  (e: 'submit'): void;
  (e: 'remove-document', value: FileType): void;
}>();

const model = computed({
  get: () => {
    if (!props.modelValue?.documents) {
      return { ...props.modelValue, documents: [] };
    }

    return props.modelValue;
  },
  set: (v) => emit('update:modelValue', v),
});

const formRef = ref<null | HTMLFormElement>(null);

const previewModel = reactive({
  dialog: false as boolean,
  image: '' as string,
});

const scan = async (): Promise<void> => {
  const blob = await takePicture();

  model.value.documents.push({ id: Date.now(), blob });
};

const emitSubmit = async (): Promise<void> => {
  const valid = await formRef.value?.validate();

  if (valid) {
    onSubmit();
  }
};

const onSubmit = () => {
  emit('submit');
};

const removeDocument = (d: FileType) => {
  model.value.documents = model.value.documents.filter(({ id }) => d.id !== id);
  emit('remove-document', d);
};

onUnmounted(answerKey.resetPreparationForm);
</script>
