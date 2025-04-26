<template>
  <q-dialog full-width v-model="dialogModel">
    <q-card>
      <q-card-section class="q-pa-none relative">
        <q-img
          :src="snapshotModel"
          fit="contain"
          style="max-height: 80dvh"
          width="100%"
          position="center"
          class="bg-black"
        >
          <div
            class="absolute all-pointer-eventsxx rounded-borders"
            style="top: 8px; left: 8px; padding: 0.5rem"
          >
            <div class="flex items-center gap-2 text-[1rem]">
              <q-icon name="visibility" />
              <span> Preview </span>
            </div>
          </div>
        </q-img>

        <div
          class="absolute all-pointer-events bg-gray-300/60 rounded-borders"
          style="bottom: 8px; right: 8px"
        >
          <q-btn v-close-popup flat label="close" color="white" unelevated />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    dialog: boolean;
    snapshot: string;
  }>(),
  {
    dialog: false,
    snapshot: '',
  },
);

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void;
  (e: 'update:snapshot', value: string): void;
}>();

const dialogModel = computed({
  get: () => props.dialog,
  set: (v) => emit('update:dialog', v),
});

const snapshotModel = computed({
  get: () => props.snapshot,
  set: (v) => emit('update:snapshot', v),
});
</script>
