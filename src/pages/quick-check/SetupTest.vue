<template>
  <q-page class="p-6 bg-white/[75%]">
    <div class="q-gutter-md">
      <q-input label="Test Name" :model-value="checkerStore.test?.name" outlined readonly>
        <template v-slot:append>
          <q-icon name="title" size="xs" />
        </template>
      </q-input>

      <q-select
        outlined
        label="Subject"
        :model-value="checkerStore.test?.subject"
        option-label="name"
        option-value="id"
        readonly
        dropdown-icon=""
      />

      <div>
        <q-list>
          <q-item
            v-for="mode in evaluationModes"
            :key="mode.value"
            tag="label"
            class="q-px-none"
            clickable
            v-ripple
          >
            <q-item-section side top>
              <q-radio color="secondary" v-model="checkerStore.mode" :val="mode.value" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ mode.title }}</q-item-label>
              <q-item-label caption>{{ mode.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mt-4">
      <div v-for="i in 5" :key="i" class="shadow-3 rounded-borders overflow-hidden">
        <q-img
          src="https://media.istockphoto.com/id/1153672822/vector/contract-papers-document-folder-with-stamp-and-text-stack-of-agreements-document-with.jpg?s=612x612&w=0&k=20&c=kjNCXISJ69chBylPnz_pY_jDPlyus3qxB38soxW78J8="
          no-native-menu
        >
          <div class="absolute-full flex flex-center"></div>

          <q-btn
            icon="close"
            size="xs"
            round
            class="absolute all-pointer-events"
            style="top: 8px; right: 8px"
            color="grey-6"
            unelevated
          />
        </q-img>
      </div>

      <div class="border-dashed border-gray-400 border-2 rounded-2xl shadow-3">
        <q-btn color="grey-6" class="full-width full-height" flat>
          <div class="flex column items-center justify-center">
            <q-icon name="upload" />
            <span>Answer Key</span>
          </div>
        </q-btn>
      </div>
    </div>
  </q-page>

  <q-footer reveal class="bg-white px-6" elevated>
    <div class="my-6">
      <q-btn
        label="Start checking"
        class="full-width"
        padding="0.875rem"
        icon="document_scanner"
        color="teal"
      />
    </div>
  </q-footer>
</template>

<script setup lang="ts">
/* eslint-disable */
import { useCheckerStore } from 'src/stores/checker-store';
import { ref } from 'vue';

const evaluationModes = [
  {
    value: 'enforceKey',
    title: 'Use Answer Key',
    description: 'Only accepts answers that match the key.',
  },
  {
    value: 'aiInference',
    title: 'AI-Based Check',
    description: 'Uses AI to evaluate answers without a key.',
  },
  {
    value: 'useQuestionnaire',
    title: 'From Questionnaire',
    description: 'Analyzes questions to infer correct answers.',
  },
] as const;
const checkerStore = useCheckerStore();

const aiAssistance = ref<boolean>(false);
</script>
