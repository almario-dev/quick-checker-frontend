<template>
  <q-page class="p-6 bg-white/[75%]">
    <CustomForm no-title @submit="createTest" body-class="q-pa-none">
      <q-input label="Name" v-model="newTest.name" filled lazy-rules :rules="[...fieldRules]">
        <template v-slot:append>
          <q-icon name="title" size="xs" />
        </template>
      </q-input>

      <q-select
        filled
        label="Subject"
        v-model="newTest.subject"
        :options="subjectStore.getSubjects"
        option-label="name"
        option-value="id"
        lazy-rules
        :rules="[...fieldRules]"
      />

      <template v-slot:actions>
        <div class="flex full-width justify-center">
          <q-btn
            type="submit"
            label="create new test"
            color="positive"
            padding="sm md"
            :disable="loading"
            :loading="loading"
          />
        </div>
      </template>
    </CustomForm>

    <div class="text-center text-[1rem] font-medium text-blue-grey-8 py-4">OR</div>

    <q-card flat class="bg-transparent">
      <q-card-section>
        <Title dialog title="Choose a Previous Test" class="text-center text-uppercasex" />
      </q-card-section>

      <q-card-section class="q-px-none">
        <q-input v-model="search" dense rounded outlined placeholder="Search...">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-list class="q-gutter-y-sm q-mt-md">
          <q-item
            v-for="test in testStore.all"
            :key="test.id"
            class="bg-white shadow-1 rounded-borders"
            clickable
            v-ripple
            @click="nextStep(test)"
          >
            <q-item-section avatar>
              <q-avatar rounded font-size="2rem" text-color="grey-5" icon="description" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="2" class="font-[600]">{{ test.name }} </q-item-label>
              <q-item-label lines="1" caption> Subject: {{ test.subject.name }} </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-item-label lines="1" caption> - </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { skip } from 'src/assets/utils';
import { CustomForm, Title } from 'src/components';
import type { Subject, Test } from 'src/composables/interfaces/IApp';
import { createRules } from 'src/composables/useRules';
import { useCheckerStore } from 'src/stores/checker-store';
import { useSubjectStore } from 'src/stores/subject-store';
import { useTestStore } from 'src/stores/test-store';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const testStore = useTestStore();
const subjectStore = useSubjectStore();
const checkerStore = useCheckerStore();

const newTest = reactive({
  name: '' as string,
  subject: null as Subject | null,
});

const loading = ref<boolean>(false);
const search = ref<string>('');

const fieldRules = createRules({ required: true });

const nextStep = (test: Test): void => {
  checkerStore.setTest(test);
  router.push({ name: 'Setup' }).catch(skip);
};

const createTest = (): void => {
  if (!newTest.subject?.id) return;

  const {
    name,
    subject: { id },
  } = newTest;

  loading.value = true;

  testStore
    .create(name, id)
    .then(nextStep)
    .catch(skip)
    .finally(() => (loading.value = false));
};
</script>
