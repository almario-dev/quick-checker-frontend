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
          v-model="testTitle"
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
          v-model="subject"
          label="Subject"
          :options="subjectOptions"
        />

        <div class="flex items-center justify-between no-wrap gap-4">
          <div class="flex column">
            <span class="text-body text-weight-medium">AI Assistance</span>
            <span class="text-caption text-grey-7"> Apply AI's general knowledge reasoning </span>
          </div>
          <q-toggle v-model="aiAssistance" icon="smart_toy" color="secondary" />
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
          />
        </q-card-section>

        <q-card-section class="q-px-none">
          <q-list class="q-gutter-sm">
            <q-item v-for="i in 20" :key="i" class="q-px-none">
              <q-item-section avatar>
                <q-img
                  src="https://www.shutterstock.com/image-vector/document-contract-papers-paper-documents-600nw-2496821589.jpg"
                  alt=""
                />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">
                  <span class="text-weight-medium">Student Answer {{ i }}</span>
                </q-item-label>
                <q-item-label caption>complete</q-item-label>
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
</template>

<script setup lang="ts">
import { ref } from 'vue';

const testTitle = ref<string>('');
const subject = ref<string>('');
const aiAssistance = ref<boolean>(false);

const subjectOptions = ['Subject 1', 'Subject 2'];
</script>
