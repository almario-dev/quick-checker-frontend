<template>
  <div class="text-weight-medium text-[1.25rem] q-py-md text-center text-grey-8" v-bind="$attrs">
    {{ title }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: 'Page Title' },
});
</script>
