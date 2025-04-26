<template>
  <q-layout view="lHh LpR fFf">
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
import { useRouter } from 'vue-router';

const router = useRouter();

const back = (): void => router.go(-1);
</script>
