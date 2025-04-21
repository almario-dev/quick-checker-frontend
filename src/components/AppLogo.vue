<template>
  <img class="app-logo" src="/logo.png" alt="AppLogo" :style="{ '--size': logoSize }" />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed } from 'vue';

const logoSizes = {
  xs: '3rem',
  sm: '4rem',
  md: '5rem',
  lg: '6rem',
  xl: '7rem',
};

const props = defineProps({
  size: { type: String },
});

const $q = useQuasar();

const logoSize = computed(() => {
  if (!props.size) {
    const screen = $q.screen;

    if (screen.gt.lg) return logoSizes.lg;
    if (screen.gt.md) return logoSizes.md;
    if (screen.gt.sm) return logoSizes.sm;
    return logoSizes.xs;
  }

  return logoSizes[props.size as keyof typeof logoSizes] || props.size;
});
</script>

<style scoped>
.app-logo {
  --size: 3rem;
  width: var(--size);
  height: var(--size);
}
</style>
