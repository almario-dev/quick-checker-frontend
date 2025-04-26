<template>
  <q-page class="q-pa-lg bg-white">
    <p class="text-blue-grey-8 pb-4 text-center text-[0.97rem]">
      <strong>💡 AI Tip:</strong>
      <i> Lighting matters! Avoid shadows when scanning. </i>
    </p>

    <div class="q-gutter-y-lg q-mt-md">
      <q-form class="q-gutter-y-lg">
        <q-input
          clearable
          filled
          class="shadow-2"
          bg-color="grey-1"
          v-model="fields.testName"
          label="Test Name"
        >
          <template v-slot:append>
            <q-icon name="title" size="xs" />
          </template>
        </q-input>

        <q-select
          filled
          class="shadow-2"
          bg-color="grey-1"
          v-model="fields.subject"
          label="Subject"
          :options="subjectOptions"
          option-label="name"
          option-value="id"
        />

        <div class="flex items-center justify-between no-wrap gap-4">
          <div class="flex column">
            <span class="text-body text-weight-medium">AI Assistance</span>
            <span class="text-caption text-grey-7"> Apply AI's general knowledge reasoning </span>
          </div>
          <q-toggle v-model="fields.aiAssistance" icon="smart_toy" color="secondary" />
        </div>
      </q-form>
      <q-separator />

      <q-card class="bg-transparent no-shadow">
        <q-card-section class="q-pa-none q-pb-sm">
          <q-btn
            class="full-width"
            icon="document_scanner"
            color="cyan-6"
            label="Scan Answer Sheets"
            padding="0.7rem"
            @click="scanAnswerSheets"
          />
        </q-card-section>

        <q-card-section class="q-px-none">
          <q-list class="q-gutter-sm">
            <q-item
              v-for="(sheet, i) in revAnswerSheets"
              :key="i"
              class="q-px-none"
              v-ripple
              clickable
              @click="openPreviewDialog(sheet)"
            >
              <q-item-section avatar>
                <q-img
                  :ratio="3 / 4"
                  :src="blobToImageUrl(sheet.file)"
                  alt=""
                  style="max-height: 4rem"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">
                  <span class="text-weight-medium">Student Answer {{ i }}</span>
                </q-item-label>
                <q-item-label caption>{{ formatBlobSize(sheet.file) }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="flex items-center gap-1">
                  <q-btn size="12px" flat dense round icon="edit" color="grey-7" />
                  <q-btn size="12px" flat dense round icon="close" color="red-5" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>

  <!-- <Preview v-model:dialog="previewDialog" v-model:preview="previewSheet" /> -->
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { AnswerSheet, Subject } from 'src/composables/interfaces/IApp';
import { blobToImageUrl, formatBlobSize, takePicture } from 'src/composables/useCamera';
import { useAlertStore } from 'src/stores/alert-store';
import { useSubjectStore } from 'src/stores/subject-store';
// import { Preview } from 'src/components';
import { newAnswerSheet } from 'src/assets/utils';

const subjectStore = useSubjectStore();
const alertStore = useAlertStore();

const answerSheets = ref<AnswerSheet[]>([]);
const previewDialog = ref<boolean>(false);
const previewSheet = ref<AnswerSheet | null>(null);

const fields = reactive({
  testName: '' as string,
  subject: null as Subject | null,
  aiAssistance: false as boolean,
});

const subjectOptions = computed(() => subjectStore.getSubjects);

const revAnswerSheets = computed(() => [...answerSheets.value].reverse());

const openPreviewDialog = (image: AnswerSheet) => {
  previewSheet.value = image;
  previewDialog.value = true;
};

const scanAnswerSheets = async (): Promise<void> => {
  try {
    const file = await takePicture();

    const obj = newAnswerSheet(file);

    answerSheets.value.push(obj);
    openPreviewDialog(obj);
  } catch (err) {
    if (err instanceof Error && err.message === 'PARSING_ERROR') {
      alertStore.Swap({ message: 'Unable to process images from camera' });
    }

    console.error(err);
  }
};
</script>
