<template>
  <q-form autofocus @submit.prevent="submit">
    <q-card-section v-if="!noTitle">
      <slot name="title">
        <TitleElement :title="title" class="text-left" />
      </slot>
    </q-card-section>

    <q-card-section :class="['q-gutter-y-md', bodyClass]">
      <slot />
    </q-card-section>

    <q-card-actions v-if="!noActions" align="right" class="q-pa-md">
      <slot name="actions">
        <q-btn label="cancel" color="grey-8" flat v-close-popup :disable="disableActions" />
        <q-btn
          type="submit"
          color="secondary"
          :label="submitButtonText"
          :loading="loading"
          :disable="disableActions"
        />
      </slot>
    </q-card-actions>
  </q-form>
</template>

<script setup lang="ts">
import { Title as TitleElement } from '.';

withDefaults(
  defineProps<{
    title: string;
    noTitle?: boolean;
    noActions?: boolean;
    bodyClass?: string;
    disableActions?: boolean;
    loading?: boolean;
    submitButtonText?: string;
  }>(),
  {
    title: '',
    bodyClass: '',
    noTitle: false,
    noActions: false,
    disableActions: false,
    loading: false,
    submitButtonText: 'Submit',
  },
);

const emit = defineEmits<{
  (e: 'submit'): void;
}>();

const submit = () => {
  emit('submit');
};
</script>
