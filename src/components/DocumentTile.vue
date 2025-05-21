<template>
  <div
    class="h-[5rem] shadow-3 rounded-borders overflow-hidden relative"
    v-ripple="!isError"
    @click="onClick"
  >
    <q-img
      :src="doc.blob ? blobToImageUrl(doc.blob) : doc.path"
      no-native-menu
      height="100%"
      @error="isError = true"
    >
      <template v-slot:error>
        <span
          class="text-center text-uppercase text-grey-7 leading-none flex items-center justify-center w-full h-full"
        >
          Image not available
        </span>
        <q-btn
          v-if="!loading"
          icon="close"
          size="xs"
          round
          class="absolute all-pointer-events"
          style="top: 8px; right: 8px"
          color="grey-5"
          unelevated
          v-ripple.stop
          @click="emit('remove', doc)"
        />
      </template>

      <div class="absolute-full flex flex-center"></div>
      <q-btn
        v-if="!loading"
        icon="close"
        size="xs"
        round
        class="absolute all-pointer-events"
        style="top: 8px; right: 8px"
        color="grey-5"
        unelevated
        v-ripple.stop
        @click="emit('remove', doc)"
      />
    </q-img>
  </div>
</template>

<script setup lang="ts">
import type { FileType } from 'src/composables/types/app';
import { blobToImageUrl } from 'src/composables/useCamera';
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    doc: FileType;
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const emit = defineEmits<{
  (e: 'remove', value: FileType): void;
  (e: 'preview', value: string | Blob): void;
}>();

const isError = ref<boolean>(false);

const onClick = () => {
  if (isError.value) return; // disable click if rendering error

  emit('preview', props.doc.path || props.doc.blob || '');
};
</script>
