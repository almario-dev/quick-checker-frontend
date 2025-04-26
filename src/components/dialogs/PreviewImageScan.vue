<template>
  <q-dialog full-width v-model="dialogModel">
    <q-card>
      <CustomForm title="Preview">
        <q-img :src="imgSrc" style="max-height: 60dvh" />

        <q-input
          v-model="controls.name"
          label="Set Student Name"
          clearable
          :disable="controls.autoDetect"
        />

        <template v-slot:actions>
          <div class="full-width flex items-center justify-between">
            <q-toggle v-model="controls.autoDetect" label="Auto-detect name" size="sm" />

            <div class="flex items-center gap-3">
              <q-btn icon="refresh" color="secondary" />
              <q-btn color="positive" label="OK" padding="sm md" />
            </div>
          </div>
        </template>
      </CustomForm>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { AnswerSheet } from 'src/composables/interfaces/IApp';
import { CustomForm } from '..';
import { computed, reactive, watch } from 'vue';
import { blobToImageUrl } from 'src/composables/useCamera';

const props = withDefaults(
  defineProps<{
    preview: AnswerSheet | null;
    dialog: boolean;
    recapture?: boolean;
  }>(),
  {
    dialog: false,
    preview: null,
  },
);

const emit = defineEmits<{
  (e: 'update:preview', value: AnswerSheet | null): void;
  (e: 'update:dialog', value: boolean): void;
}>();

const dialogModel = computed({
  get: () => props.dialog,
  set: (value) => emit('update:dialog', value),
});

const imgSrc = computed(() => (props.preview ? blobToImageUrl(props.preview.file) : ''));

const controls = reactive({
  name: '' as string,
  autoDetect: false as boolean,
});

const autoDetectName = (mode: boolean = true): void => {
  if (mode) {
    controls.name = '';
  }

  controls.autoDetect = mode;
};

watch(
  () => props.preview,
  (value) => {
    if (value?.name === true) {
      autoDetectName(true);
      return;
    }

    controls.autoDetect = false;
    controls.name = value?.name || '';
  },
  { immediate: true, deep: true },
);
</script>
