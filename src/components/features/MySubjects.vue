<template>
  <q-card class="bg-transparent no-shadow q-mb-md">
    <q-card-section class="q-px-none">
      <div class="flex items-center justify-between text-[1rem] font-[500] text-blue-grey-10">
        <span>My Subjects</span>
        <q-btn color="accent" size="0.785rem" dense icon="add" @click="dialog = true" />
      </div>
    </q-card-section>

    <q-card-section class="q-px-none q-pt-none">
      <div class="bg-white shadow-3 rounded-borders">
        <q-list separator>
          <q-item v-for="subject in paginatedSubjects" :key="subject.id" class="q-py-md">
            <q-item-section>
              <q-item-label lines="1" class="font-[600]">{{ subject.name }} </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn size="12px" flat dense round icon="more_vert">
                <q-menu>
                  <q-list style="min-width: 5rem">
                    <q-item clickable v-close-popup @click="openEditDialog(subject)">
                      <q-item-section>Edit</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="deleteSubject(subject)">
                      <q-item-section>Delete</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="flex justify-center q-mt-md">
        <q-pagination
          v-model="page"
          :max="maxPage"
          :max-pages="5"
          boundary-numbers
          size="0.75rem"
          color="grey-7"
        />
      </div>
    </q-card-section>
  </q-card>

  <SubjectDialog v-model:dialog="dialog" v-model:edit="editModel" @success="subjectStore.fetch" />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import type { Subject } from 'src/composables/interfaces/IApp';
import { computed, onMounted, ref } from 'vue';
import { SubjectDialog } from '..';
import { useSubjectStore } from 'src/stores/subject-store';
import { skip } from 'src/assets/utils';

const $q = useQuasar();
const subjectStore = useSubjectStore();

const dialog = ref<boolean>(false);
const editModel = ref<Subject | null>(null);

const page = ref(1);
const perPage = 5;

const maxPage = computed(() => Math.ceil(subjectStore.getSubjects.length / perPage));

const paginatedSubjects = computed(() => {
  const start = (page.value - 1) * perPage;
  const end = start + perPage;
  return subjectStore.getSubjects.slice(start, end);
});

const openEditDialog = (subject: Subject) => {
  editModel.value = subject;
  dialog.value = true;
};

const deleteSubject = (subject: Subject) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: "Do you really want to delete this subject? You won't be able to use it again.",
    cancel: true,
    ok: 'Yes',
  }).onOk(() => {
    subjectStore.archive(subject.id).catch(skip);
  });
};

onMounted(subjectStore.init);
</script>
