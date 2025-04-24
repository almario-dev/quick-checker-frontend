<template>
  <q-dialog full-width v-model="dialogModel" @hide="onHide">
    <q-card>
      <CustomForm
        @submit="submit"
        :title="formTitle"
        :loading="idleMode"
        :disable-actions="idleMode"
        :submit-button-text="submitBtnLabel"
      >
        <q-input outlined v-model="name" label="Name" />
      </CustomForm>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { Subject } from 'src/composables/interfaces/IApp';
import { CustomForm } from '..';
import { computed, ref, watch } from 'vue';
import { api } from 'src/boot/axios';
import { useAlertStore } from 'src/stores/alert-store';

const alertStore = useAlertStore();

const props = withDefaults(
  defineProps<{
    dialog: boolean;
    edit: Subject | null;
  }>(),
  {
    dialog: false,
    edit: null,
  },
);

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void;
  (e: 'update:edit', value: Subject | null): void;
  (e: 'success'): void;
}>();

const name = ref<string>('');
const idleMode = ref<boolean>(false);

watch(
  () => props.edit,
  (edit) => {
    name.value = edit?.name || '';
  },
  { immediate: true },
);

const dialogModel = computed({
  get: () => props.dialog,
  set: (value) => emit('update:dialog', value),
});

const formTitle = computed(() => `${props.edit ? 'Edit' : 'Add'} Subject`);

const submitBtnLabel = computed(() => (props.edit ? 'Save' : 'Submit'));

const wait = () => (idleMode.value = true);

const complete = () => (idleMode.value = false);

const onHide = () => {
  idleMode.value = false;
  emit('update:edit', null);
};

const submit = () => {
  wait();

  if (!props.edit) {
    // add new subject
    api
      .post('subjects', { name: name.value })
      .then(() => {
        emit('success');
        emit('update:dialog', false);

        name.value = '';

        alertStore.Swap({ type: 'positive', message: 'A new subject has been added.' });
      })
      .catch((err) => {
        const message =
          err?.response?.data?.message || 'Unable to add new subject. Please try again.';
        alertStore.Swap({ type: 'negative', message });
      })
      .finally(complete);
  } else if (props.edit.id) {
    // edit
    api
      .put('subjects/' + props.edit.id, { name: name.value })
      .then(() => {
        emit('success');
        emit('update:dialog', false);

        name.value = '';

        alertStore.Swap({ type: 'positive', message: 'Updated successfully.' });
      })
      .catch((err) => {
        const message = err?.response?.data?.message || 'Unable to save changes. Please try again.';
        alertStore.Swap({ type: 'negative', message });
      })
      .finally(complete);
  }
};
</script>
