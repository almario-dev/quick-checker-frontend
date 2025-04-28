<template>
  <div class="grid grid-cols-3 gap-4" v-bind="$attrs">
    <div
      v-if="usePlaceholder && !hasDocuments"
      class="col-span-3 overflow-hidden my-2 text-center relative column gap-4"
    >
      <q-img src="src/assets/svg/empty.svg" height="5rem" fit="contain" />
      <span class="text-grey-6 font-[400] text-[1rem]">No Documents Available</span>
    </div>

    <div
      v-for="({ file, id }, i) in documentsModel ?? []"
      :key="i"
      class="h-[5rem] shadow-3 rounded-borders overflow-hidden relative"
      v-ripple
      @click="openPreview(file)"
    >
      <q-img :src="blobToImageUrl(file)" no-native-menu height="100%">
        <div class="absolute-full flex flex-center"></div>
        <q-btn
          icon="close"
          size="xs"
          round
          class="absolute all-pointer-events"
          style="top: 8px; right: 8px"
          color="grey-6"
          unelevated
          v-ripple.stop
          @click="remove(id)"
        />
      </q-img>
    </div>

    <slot name="after" />
  </div>

  <Preview v-model:dialog="previewModel.dialog" v-model:snapshot="previewModel.image" />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import type { LocalFileType } from 'src/composables/types/app';
import { blobToImageUrl } from 'src/composables/useCamera';
import { computed, reactive } from 'vue';
import { Preview } from '.';

const $q = useQuasar();

const props = withDefaults(
  defineProps<{
    documents: LocalFileType[] | null;
    usePlaceholder?: boolean;
  }>(),
  {
    documents: null,
    usePlaceholder: false,
  },
);

const emit = defineEmits<{
  (e: 'update:documents', value: LocalFileType[] | null): void;
  (e: 'remove', value: string): void;
}>();

const previewModel = reactive({
  dialog: false as boolean,
  image: '' as string,
});

const documentsModel = computed({
  get: () => props.documents,
  set: (v) => emit('update:documents', v),
});

const hasDocuments = computed(() => props.documents?.length);

const remove = (id: string): void => {
  $q.dialog({
    title: 'Remove File',
    message: 'This action cannot be undone.',
    cancel: true,
    ok: 'Confirm',
  }).onOk(() => emit('remove', id));
};

const openPreview = (file: Blob): void => {
  previewModel.image = blobToImageUrl(file);
  previewModel.dialog = true;
};
</script>
