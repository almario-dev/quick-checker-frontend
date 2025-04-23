<template>
  <q-layout view="lHh LpR fFf" class="text-blue-grey-10 bg-white">
    <q-header reveal :reveal-offset="50" class="bg-white">
      <q-toolbar class="flex items-center">
        <q-btn icon="arrow_back" text-color="grey-8" round flat class="q-mr-auto" @click="back" />
        <Title class="grow" title="New Scan" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal class="bg-transparent" elevated>
      <div class="flex q-px-lg q-py-md items-stretch gap-4 bg-white">
        <q-btn color="positive" padding="1rem" icon="spellcheck" />
        <q-btn class="grow" color="primary" label="Quick Check" />
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { Title } from 'src/components';
import { useRouter } from 'vue-router';

const router = useRouter();

function back() {
  router.go(-1);
}
</script>
