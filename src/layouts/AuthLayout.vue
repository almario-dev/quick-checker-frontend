<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-transparent text-grey-7 flex justify-center">
      <div>
        <span class="cursor-pointer" @click="openLink">{{ productName }}</span>
        v{{ version }} &copy; 2025
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { version, productName } from '../../package.json';

const host = computed(() => import.meta.env.VITE_API);

const openLink = () => {
  window.open(host.value, '_blank');
};
</script>
