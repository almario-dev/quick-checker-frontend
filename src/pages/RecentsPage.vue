<template>
  <q-page class="q-pa-md">
    <q-card class="bg-transparent no-shadow">
      <q-card-section class="flex gap-[1rem] items-start q-px-none">
        <q-input
          v-if="answerSheetStore.getList.length"
          class="grow"
          outlined
          clearable
          v-model="search"
          label="Search"
          debounce="1000"
          @update:model-value="onSearch"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="q-pa-none q-pt-md">
        <AnswerSheets
          v-if="answerSheetStore.getList.length"
          v-model:list="answerSheetStore.list"
          v-model:search="search"
        />

        <NoData v-else />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
/* eslint-disable */
import { AnswerSheets, NoData } from 'src/components';
import { useAnswerKeyStore } from 'src/stores/answer-key-store';
import { isChecked, isRaw, useAnswerSheetStore } from 'src/stores/answer-sheet-store';
import { ref } from 'vue';

const search = ref<string>('');
const answerSheetStore = useAnswerSheetStore();
const answerKeyStore = useAnswerKeyStore();

const onSearch = (v: string | number | null): void => {};

// const answerSheetsList = computed(() => [...answerSheetStore.getList].reverse())
</script>
