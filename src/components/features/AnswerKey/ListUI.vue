<template>
  <q-card class="bg-transparent no-shadow q-mb-md">
    <q-card-section class="q-px-none">
      <div class="flex items-center justify-between text-[1rem] font-[500] text-blue-grey-10">
        <span>Answer Key Sources</span>
        <q-btn
          v-if="answerKeyStore.getAnswerKeys.length"
          color="blue-grey-11"
          text-color="primary"
          rounded
          size="sm"
          dense
          icon="add"
          class="q-mr-sm"
          @click="gotoCreate"
        />
      </div>
    </q-card-section>

    <q-card-section v-if="answerKeyStore.getAnswerKeys.length" class="q-pa-none">
      <div class="bg-white shadow-3 rounded-borders">
        <q-list separator>
          <q-item v-for="key in paginatedAnswerKeys" :key="key.id" class="q-py-md q-pl">
            <q-item-section avatar class="q-pr-sm">
              <q-avatar size="2.5rem" color="grey-11">
                <q-img :src="TestPng" width="60%" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1" class="font-[500]">{{ key.name }} </q-item-label>
              <q-item-label caption class="flex items-center gap-x-2 text-blue-grey-8 flex-wrap">
                <span> Total Points: {{ key.score }} </span>
                <!-- <q-separator vertical />
                <span>{{ key.scans }} scans</span> -->
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn
                size="12px"
                unelevated
                color="grey-2"
                text-color="grey-6"
                dense
                round
                icon="chevron_right"
                :to="{ name: 'Answer Key Details', params: { id: key.id } }"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="flex justify-center q-mt-md" v-if="paginatedAnswerKeys.length > perPage">
        <q-pagination
          v-model="page"
          :max="maxPage"
          :max-pages="5"
          boundary-numbers
          size="0.75rem"
          color="grey-7"
        />
      </div>
    </q-card-section>

    <NoData v-else>
      <q-btn label="Create" color="primary" @click="gotoCreate" />
    </NoData>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { NoData } from '../..';
import { useRouter } from 'vue-router';
import { TestPng } from '../../images';
import { useAnswerKeyStore2 } from 'src/stores/answer-key';

const router = useRouter();
const answerKeyStore = useAnswerKeyStore2();

const page = ref(1);
const perPage = 5;

const maxPage = computed(() => Math.ceil(answerKeyStore.getAnswerKeys.length / perPage));

const paginatedAnswerKeys = computed(() => {
  const start = (page.value - 1) * perPage;
  const end = start + perPage;
  return answerKeyStore.getAnswerKeys.slice(start, end);
});

const gotoCreate = async (): Promise<void> => {
  await router.push({ name: 'Create Answer Key' });
};
</script>
