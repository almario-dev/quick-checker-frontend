<template>
  <q-dialog v-model="model" full-width v-bind="$attrs" @hide="emit('update:modelValue', false)">
    <q-card>
      <q-card-section class="flex items-center justify-between">
        <div class="text-[1rem] font-[500]">Preferences</div>
        <q-btn icon="close" flat dense color="grey-5" round v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-gutter-y-md q-pb-lg">
        <div class="flex items-center justify-between no-wrap gap-4">
          <div class="flex column">
            <span class="text-body">AI Checker</span>
            <span class="text-caption text-grey-7">
              Automatically checks answers without using an answer key
            </span>
          </div>
          <q-toggle v-model="scanStore.preferences.aiChecker" icon="smart_toy" color="secondary" />
        </div>

        <div class="flex items-center justify-between no-wrap gap-4">
          <div class="flex column">
            <span class="text-body">Answer Key Mode</span>
            <span class="text-caption text-grey-7">
              Scan an answer key to use as the correct reference
            </span>
          </div>
          <q-toggle
            v-model="scanStore.preferences.answerKeyMode"
            icon="spellcheck"
            color="blue-9"
          />
        </div>

        <div class="flex items-center justify-between no-wrap gap-4">
          <div class="flex column">
            <span class="text-body">Skip Preview</span>
            <span class="text-caption text-grey-7"> Skip document preview and scan directly </span>
          </div>
          <q-toggle
            v-model="scanStore.preferences.skipPreview"
            icon="visibility_off"
            color="teal"
          />
        </div>

        <div class="flex items-center justify-between no-wrap gap-4">
          <div class="flex column">
            <span class="text-body">Camera</span>
            <span class="text-caption text-grey-7"> Choose camera device </span>
          </div>

          <q-select
            style="max-width: 8rem"
            rounded
            outlined
            v-model="scanStore.preferences.cameraDevice"
            :options="cameraOptions"
            dense
            emit-value
            map-options
            :option-value="extractCameraId"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useScanStore } from 'src/stores/scan-store';
import { ref, watch } from 'vue';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  preferences: { type: Object },
  cameraOptions: { type: Array },
});

const scanStore = useScanStore();
const model = ref<boolean>(props.modelValue);

const extractCameraId = (v: MediaDeviceInfo | null): string | null => v?.deviceId || null;

watch(
  () => props.modelValue,
  (newValue) => (model.value = newValue),
);

watch(
  () => model.value,
  (newValue) => {
    if (newValue !== props.modelValue) {
      emit('update:modelValue', newValue);
    }
  },
);
</script>
