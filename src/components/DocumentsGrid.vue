<template>
  <div class="grid grid-cols-3 gap-4" v-bind="$attrs">
    <div
      v-if="usePlaceholder && !hasDocuments"
      class="col-span-3 overflow-hidden my-2 text-center relative column gap-4"
    >
      <q-img :src="EmptySvg" height="5rem" fit="contain" />
      <span class="text-grey-6 font-[400] text-[1rem]">No Documents Available</span>
    </div>

    <DocumentTile
      v-for="doc in documentsModel ?? []"
      :key="doc.id"
      :doc="doc"
      :loading="props.loading"
      @remove="remove"
      @preview="openPreview"
    />

    <slot name="after" />
  </div>

  <Preview v-model:dialog="previewModel.dialog" v-model:snapshot="previewModel.image" />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import type { FileType } from 'src/composables/types/app';
import { blobToImageUrl } from 'src/composables/useCamera';
import { computed, reactive } from 'vue';
import { DocumentTile, Preview } from '.';
import { EmptySvg } from './images';

const $q = useQuasar();

const props = withDefaults(
  defineProps<{
    documents: FileType[];
    usePlaceholder?: boolean;
    loading?: boolean;
  }>(),
  {
    usePlaceholder: false,
    loading: false,
  },
);

const emit = defineEmits<{
  (e: 'update:documents', value: FileType[]): void;
  (e: 'remove', value: FileType): void;
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

const remove = (file: FileType): void => {
  $q.dialog({
    title: 'Remove File?',
    message: 'This action cannot be undone.',
    cancel: true,
    ok: 'Confirm',
  }).onOk(() => emit('remove', file));
};

const openPreview = (file: Blob | string | undefined): void => {
  if (!file) return;

  if (typeof file === 'string') {
    previewModel.image = file;
  } else if (file instanceof Blob) {
    previewModel.image = blobToImageUrl(file);
  }

  previewModel.dialog = true;
};
</script>
