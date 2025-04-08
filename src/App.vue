<template>
  <router-view />
</template>

<script setup lang="ts">
import { api } from 'boot/axios';

const init = async () => {
  try {
    // init crsf token
    await api.get('../sanctum/csrf-cookie');
  } catch (err) {
    console.error('Failed to get CSRF cookie:', err);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
init();
</script>
