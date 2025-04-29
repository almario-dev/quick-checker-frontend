<template>
  <q-page class="q-pa-md">
    <div>
      <h5 class="text-bold mb-6 mt-4 flex items-center gap-2">
        <span class="wave-emoji">👋</span>
        Hi,
        {{ userStore.getData?.name }}!
      </h5>
    </div>

    <div class="q-mt-sm q-gutter-sm">
      <q-card class="shadow-6">
        <q-card-section>
          <div class="text-[1.3rem] text-blue-grey-9 mb-5 mt-2">Ready to check some tests?</div>

          <p class="text-blue-grey-8">
            <strong>💡 AI Tip:</strong>
            <i> Lighting matters! Avoid shadows when scanning. </i>
          </p>
          <q-btn
            label="Scan Now"
            color="secondary"
            icon="document_scanner"
            padding="0.7rem"
            @click="scanStore.scanNow"
          />
        </q-card-section>
      </q-card>

      <q-card class="bg-transparent no-shadow">
        <q-card-section class="q-px-none">
          <div class="text-[1rem] font-[500] text-blue-grey-10">Latest check(s)</div>
        </q-card-section>

        <q-card-section v-if="answerSheetStore.getList.length" class="q-pa-none">
          <AnswerSheets v-model:list="answerSheetStore.list" no-pagination :display-only="5" />

          <div class="flex justify-center" v-if="answerSheetStore.getList.length > 5">
            <q-btn label="View More" flat text-color="blue-grey-5" :to="{ name: 'Recents' }" />
          </div>
        </q-card-section>

        <NoData v-else />
      </q-card>

      <MyAnswerKeys />

      <MySubjects />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { MyAnswerKeys, MySubjects, NoData } from 'src/components';
import { useScanStore } from 'src/stores/scan-store';
import { useUserStore } from 'src/stores/user-store';
import { AnswerSheets } from '../components';
import { useAnswerSheetStore } from 'src/stores/answer-sheet-store';

const userStore = useUserStore();
const scanStore = useScanStore();
const answerSheetStore = useAnswerSheetStore();
</script>
