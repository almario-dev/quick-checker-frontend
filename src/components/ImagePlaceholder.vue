<template>
  <img
    :src="src"
    alt="Image"
    class="image-component"
    :style="{ '--size': imgSize }"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed } from 'vue';
import defaultImage from 'src/assets/img-placeholder.png';

const sizes = {
  xs: '3rem',
  sm: '4rem',
  md: '5rem',
  lg: '6rem',
  xl: '7rem',
};

const props = defineProps({
  size: { type: String },
  src: { type: String, default: defaultImage },
});

const $q = useQuasar();

const imgSize = computed(() => {
  if (!props.size) {
    const screen = $q.screen;

    if (screen.gt.lg) return sizes.lg;
    if (screen.gt.md) return sizes.md;
    if (screen.gt.sm) return sizes.sm;
    return sizes.xs;
  }

  return sizes[props.size as keyof typeof sizes] || props.size;
});
</script>

<style>
img.image-component {
  --size: 3rem;
  width: var(--size);
  height: var(--size);
}
</style>
