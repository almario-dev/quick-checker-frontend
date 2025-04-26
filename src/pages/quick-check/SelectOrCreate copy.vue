<template>
  <q-page class="flex items-center justify-center column gap-6 q-pa-lg">
    <div class="full-width">
      <q-select
        filled
        bg-color="white"
        class="full-width"
        v-model="test"
        :options="['test 1', 'test 2']"
        label="select from previous tests"
      />
    </div>
    <span>or</span>
    <q-btn v-if="false" label="Create new test" color="primary" @click="createDialog = true" />

    <q-card class="full-width shadow-8">
      <CustomForm body-class="q-pa-lg">
        <template v-slot:title>
          <Title title="Create New Test" />
        </template>

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

    <q-btn label="back" flat @click="router.go(-1)" />
  </q-page>

  <CreateTest v-model:dialog="createDialog" />
</template>

<script setup lang="ts">
import { CreateTest, CustomForm, Title } from 'src/components';
import type { Subject } from 'src/composables/interfaces/IApp';
import { createRules } from 'src/composables/useRules';
import { useSubjectStore } from 'src/stores/subject-store';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const subjectStore = useSubjectStore();

const test = ref<string>('');
const createDialog = ref<boolean>(false);

const fields = reactive({
  name: '' as string,
  subject: null as Subject | null,
});
</script>
