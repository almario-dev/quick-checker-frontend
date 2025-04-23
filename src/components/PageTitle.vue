<template>
  <div class="text-weight-medium text-[1rem] q-py-md text-center text-blue-grey-9" v-bind="$attrs">
    {{ title }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: 'Page Title' },
});
</script>
