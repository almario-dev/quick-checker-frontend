<template>
  <q-dialog v-model="dialogModel" full-width>
    <q-card>
      <CustomForm title="Create Test" :loading="idle" :disable-actions="idle" @submit="submit">
        <q-input
          v-model="fields.name"
          label="Name"
          lazy-rules
          :rules="createRules({ required: true })"
        />

        <q-select
          v-model="fields.subject"
          :options="subjectStore.getSubjects"
          option-label="name"
          option-value="id"
          label="Subject"
          lazy-rules
          :rules="createRules({ required: true })"
        />
      </CustomForm>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { CustomForm } from '..';
import type { Subject } from 'src/composables/interfaces/IApp';
import { useSubjectStore } from 'src/stores/subject-store';
import { useTestStore } from 'src/stores/test-store';
import { skip } from 'src/assets/utils';
import { createRules } from 'src/composables/useRules';

const subjectStore = useSubjectStore();
const testTore = useTestStore();

const props = withDefaults(
  defineProps<{
    dialog: boolean;
  }>(),
  { dialog: false },
);

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void;
  (e: 'success'): void;
}>();

const fields = reactive({
  name: '' as string,
  subject: null as Subject | null,
});

const idle = ref<boolean>(false);

const dialogModel = computed({
  get: () => props.dialog,
  set: (v) => emit('update:dialog', v),
});

const submit = (): void => {
  if (!fields.subject || !fields.subject?.id) return;

  idle.value = true;

  testTore
    .create(fields.name, fields.subject.id)
    .then(() => {
      emit('update:dialog', false);
      emit('success');
    })
    .catch(skip)
    .finally(() => (idle.value = false));
};
</script>
