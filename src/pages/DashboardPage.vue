<template>
  <div class="row q-mt-md">
    <q-form class="col-6 q-gutter-lg" @submit.prevent="submit">
      <q-file
        outlined
        v-model="form.answer_key"
        label="Upload questionnaire/answer key"
        accept="image/*"
        lazy-rules
        :rules="createRules({ required: true })"
      />

      <q-file
        v-model="form.student_answer_sheets"
        label="Upload students' answer sheet(s)"
        outlined
        multiple
        append
        accept="image/*"
        lazy-rules
        :rules="createRules({ required: true })"
        @rejected="onRejectedFiles"
      />

      <q-btn type="submit" label="quick check" color="teal" />
      <div v-if="perfectScore !== null">
        <span class="text-weight-bold">Perfect Score: {{ perfectScore }}</span>

        <ul>
          <li v-for="(student, index) in results" :key="index">
            {{ student.name }}: {{ student.score }}
          </li>
        </ul>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
// import { api } from 'src/boot/axios';
import { createRules } from 'src/composables/useRules';
import { reactive, ref } from 'vue';

const $q = useQuasar();

const form = reactive({
  answer_key: null,
  student_answer_sheets: [],
});

type StudentScore = {
  name: string;
  score: number;
};

const results = ref<StudentScore[]>([]);
const perfectScore = ref<number | null>(null);

const onRejectedFiles = (entries: object[]) => {
  $q.notify({
    type: 'negative',
    message: `${entries.length} file(s) did not pass validation constraints`,
  });
};

const submit = () => {
  const formData = new FormData();

  if (form.answer_key === null) {
    return;
  }

  formData.append('answer_key', form.answer_key);

  form.student_answer_sheets.forEach((file) => {
    formData.append('student_answer_sheet[]', file);
  });

  api
    .post('quick-check', formData)
    .then(({ data }) => {
      perfectScore.value = data.perfectScore;
      results.value = data.results;
    })
    .catch((err) => {
      console.error(err);
    });
};
</script>
