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
          <q-item v-for="subject in list" :key="subject.id" class="q-py-md">
            <q-item-section>
              <q-item-label lines="1" class="font-[600]">{{ subject.name }} </q-item-label>
              <q-item-label lines="2" caption> Scanned: 0 </q-item-label>
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

      <div class="flex justify-center">
        <q-btn label="show all" flat class="q-mt-md" text-color="blue-grey-5" />
      </div>
    </q-card-section>
  </q-card>

  <SubjectDialog v-model:dialog="dialog" v-model:edit="editModel" @success="fetchSubjects" />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import type { Subject } from 'src/composables/interfaces/IApp';
import { useAlertStore } from 'src/stores/alert-store';
import { onBeforeMount, ref } from 'vue';
import { SubjectDialog } from '..';

const $q = useQuasar();
const alertStore = useAlertStore();
const dialog = ref<boolean>(false);
const list = ref<Subject[]>([]);
const editModel = ref<Subject | null>(null);

onBeforeMount(async () => {
  try {
    await Promise.all([fetchSubjects()]);
  } catch (error) {
    console.error('Task has failed: ', error);
  }
});

async function fetchSubjects(): Promise<void> {
  try {
    const { data } = await api.get('subjects');
    list.value = data;
  } catch (err) {
    console.error(err);
  }
}

function openEditDialog(subject: Subject) {
  editModel.value = subject;
  dialog.value = true;
}

function deleteSubject(subject: Subject) {
  $q.dialog({
    title: 'Confirm Delete',
    message: "Do you really want to delete this subject? You won't be able to use it again.",
    cancel: true,
    ok: 'Yes',
  }).onOk(() => {
    api
      .delete('subjects/' + subject.id)
      .then(() => {
        fetchSubjects().catch(() => {});
        alertStore.Swap({ type: 'info', message: 'Subject has been deleted.' });
      })
      .catch((err) => {
        const message = err?.response?.data?.message || 'Something went wrong';
        alertStore.Swap({ message, type: 'negative' });
      });
  });
}
</script>
