<template>
  <q-layout view="lHh LpR fFf" :class="bgColor">
    <q-header reveal :reveal-offset="1" class="bg-transparent">
      <q-toolbar class="flex items-center">
        <q-btn icon="arrow_back" dense round flat color="grey-7" @click="back" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const bgColor = computed(() =>
  ['Scan Answer Sheets', 'Answer Sheet Details'].includes(String(route.name))
    ? 'bg-white'
    : 'bg-transparent',
);

const back = (): void => router.go(-1);
</script>
