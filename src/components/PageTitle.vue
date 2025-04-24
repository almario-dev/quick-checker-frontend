<template>
  <div
    :class="['text-weight-medium text-[1rem]  text-blue-grey-9', { 'q-py-md text-center': dialog }]"
    v-bind="$attrs"
  >
    {{ title }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: 'Page Title' },
  dialog: { type: Boolean, default: false },
});
</script>
