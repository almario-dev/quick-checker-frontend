<template>
  <div class="column justify-center items-center py-6 gap-4">
    <q-avatar square size="5rem">
      <q-img :src="NoDataPng" height="5rem" />
    </q-avatar>

    <span class="text-[1rem] text-grey-8">No Data Available.</span>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { NoDataPng } from './images';
</script>
