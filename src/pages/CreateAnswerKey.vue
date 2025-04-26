<template>
  <q-page>
    <div class="flexxx column items-center mt-6 gap-6 mb-6">
      <q-img src="src/assets/svg/add-files.svg" style="max-width: 45%" />
      <h6 class="text-blue-grey-8 text-weight-regular">Create Answer Key</h6>
    </div>

    <div class="bg-white p-6">
      <div class="flex items-center justify-between no-wrap gap-4 mb-4">
        <div class="flex column">
          <span class="text-body text-weight-medium">Use Questionnaire</span>
          <span class="text-caption text-grey-7">
            Upload the test questionnaire only. AI will extract answers automatically.
          </span>
        </div>
        <q-toggle
          v-model="answerKeyStore.newModel.useQuestionnaire"
          icon="fact_check"
          color="secondary"
        />
      </div>

      <div class="mb-2">
        <Title :title="filesUploadedTitle" dialog />
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="({ file, id }, i) in answerKeyStore.newModel.attachments"
          :key="i"
          class="h-[5rem] shadow-3 rounded-borders overflow-hidden relative"
          v-ripple
          @click="openPreview(file)"
        >
          <q-img :src="blobToImageUrl(file)" no-native-menu height="100%">
            <div class="absolute-full flex flex-center"></div>

            <q-btn
              icon="close"
              size="xs"
              round
              class="absolute all-pointer-events"
              style="top: 8px; right: 8px"
              color="grey-6"
              unelevated
              v-ripple.stop
              @click="removeFile(id)"
            />
          </q-img>
        </div>

        <div class="border-dashed border-gray-400 border-2 rounded-lg shadow-3 h-[5rem]">
          <q-btn color="grey-6" class="full-width full-height" flat @click="scan">
            <div class="flex column items-center justify-center">
              <q-img src="src/assets/camera.png" width="2rem" />
              <small>scan</small>
            </div>
          </q-btn>
        </div>
      </div>

      <div class="mb-2 mt-6">
        <Title title="Fill up basic info" dialog />
      </div>

      <q-form ref="formRef" class="flex column gap-2" @submit.prevent="startAnalysis">
        <q-input
          label="Name"
          outlined
          v-model="answerKeyStore.newModel.name"
          lazy-rules
          :rules="createRules({ required: true })"
        />
        <q-select
          outlined
          v-model="answerKeyStore.newModel.subject"
          :options="subjectStore.getSubjects"
          option-label="name"
          label="Subject"
          lazy-rules
          :rules="createRules({ required: true })"
        />
      </q-form>
    </div>
  </q-page>

  <q-footer reveal class="bg-white px-6" elevated>
    <div class="my-6">
      <q-btn
        label="Start Analysis"
        class="full-width"
        padding="0.875rem"
        icon="auto_awesome"
        color="teal"
        @click="emitSubmit"
      />
    </div>
  </q-footer>

  <Preview v-model:dialog="previewModel.dialog" v-model:snapshot="previewModel.image" />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { newFileObject, skip } from 'src/assets/utils';
import { Preview, Title } from 'src/components';
import { blobToImageUrl, takePicture } from 'src/composables/useCamera';
import { createRules } from 'src/composables/useRules';
import { useAnswerKeyStore } from 'src/stores/answer-key-store';
import { useSubjectStore } from 'src/stores/subject-store';
import { computed, reactive, ref } from 'vue';

const $q = useQuasar();
const subjectStore = useSubjectStore();
const answerKeyStore = useAnswerKeyStore();

const formRef = ref<null | HTMLFormElement>(null);

const previewModel = reactive({
  dialog: false as boolean,
  image: '' as string,
});

const filesUploadedTitle = computed(
  () => `Files uploaded (${answerKeyStore.newModel.attachments?.length || 0})`,
);

const openPreview = (file: Blob): void => {
  previewModel.image = blobToImageUrl(file);
  previewModel.dialog = true;
};

const removeFile = (id: string): void => {
  $q.dialog({
    title: 'Remove File',
    message: 'This action cannot be undone.',
    cancel: true,
    ok: 'Confirm',
  }).onOk(() => {
    answerKeyStore.removeAttachment(id);
  });
};

const scan = async (): Promise<void> => {
  const file = await takePicture();
  answerKeyStore.newModel.attachments?.push(newFileObject(file));
};

const startAnalysis = async (): Promise<void> => {
  try {
    const result = await answerKeyStore.create();

    if (!result) return;

    answerKeyStore.usedKeyId = result.id;
  } finally {
    skip();
  }
};

const emitSubmit = async (): Promise<void> => {
  const valid = await formRef.value?.validate();

  if (valid) {
    await startAnalysis();
  }
};
</script>
