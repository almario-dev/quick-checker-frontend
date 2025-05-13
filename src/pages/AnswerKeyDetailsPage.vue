<template>
  <q-page class="column">
    <AnswerKeySetup v-model="model" mode="edit" no-footer :loading="loading">
      <template v-slot:header>
        <div class="column items-center gap-4 full-width">
          <h6 class="text-blue-grey-8 text-center grow text-weight-regular">Use Answer Key</h6>
          <q-btn
            icon="document_scanner"
            color="secondary"
            padding="0.875rem"
            label="Scan now"
            @click="scanNow"
          />
        </div>
      </template>

      <div class="mb-1">
        <Title title="Analysis" dialog />
      </div>

      <template v-if="!loading">
        <q-card v-for="(test, tIndex) in tests" :key="tIndex" class="q-mb-md">
          <q-card-section>
            <q-expansion-item
              header-class="q-pa-none q-py-none text-weight-bold"
              :label="
                test.title +
                ' (' +
                (getTotalPoints(test.items || [], test) || test.max_points) +
                ' pts)'
              "
            >
              <div v-for="(item, iIndex) in test.items" :key="iIndex" class="analysis-test">
                <div class="row">
                  <div class="col-6">
                    <q-input
                      lazy-rules
                      :rules="createRules({ required: true })"
                      filled
                      v-model="item.item_number"
                      label="Item #"
                      type="number"
                      dense
                    />
                  </div>
                  <div class="col q-pl-md">
                    <q-input
                      lazy-rules
                      :rules="createRules({ required: true })"
                      filled
                      v-model="item.points"
                      label="Points"
                      type="number"
                      dense
                    />
                  </div>
                </div>

                <q-input
                  lazy-rules
                  :rules="createRules({ required: true })"
                  v-model="item.item_description"
                  label="Description"
                  type="textarea"
                  autogrow
                  dense
                  filled
                />
                <q-input
                  lazy-rules
                  :rules="createRules({ required: true })"
                  filled
                  v-model="item.key"
                  label="Answer Key"
                  autogrow
                  dense
                />

                <div
                  v-if="test.items && iIndex < test.items?.length - 1"
                  class="text-grey-8 q-my-md relative"
                >
                  <span
                    class="text-[0.7rem] bg-white px-1 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
                  >
                    New Item
                  </span>
                  <q-separator />
                </div>
              </div>
            </q-expansion-item>
          </q-card-section>
        </q-card>
      </template>
      <p v-else class="text-center text-italic text-grey-7">Loading analysis...</p>

      <div v-if="!loading" class="q-mb-md">
        <div class="column items-center gap-2 text-grey-9 text-[0.8rem]">
          <span>Not satisfied with the results?</span>
          <q-btn padding="0.5rem 0.75rem" color="teal" outline @click="reRunAnalysis">
            <q-icon name="auto_awesome" size="1rem" />
            <span class="ml-2">Re-run analysis</span>
          </q-btn>
        </div>
        <div class="text-grey-8 q-my-lg relative">
          <span
            class="text-[0.7rem] bg-white px-1 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
          >
            Other actions
          </span>
          <q-separator />
        </div>

        <div class="flex justify-center gap-2 text-grey-9 text-[0.8rem]">
          <q-btn
            size="0.8rem"
            padding="0.5rem 0.75rem"
            color="negative"
            icon="delete"
            label="Delete"
            @click="deleteAnswerKey"
          />
          <q-btn
            padding="0.5rem 0.75rem"
            size="0.8rem"
            color="blue-8"
            icon="save"
            label="Save changes"
            @click="saveChanges"
          />
        </div>
      </div>
    </AnswerKeySetup>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { skip } from 'src/assets/utils';
import { AnswerKeySetup, Title } from 'src/components';
import type { Test, TestItem } from 'src/composables/interfaces/IApp';
import { createRules } from 'src/composables/useRules';
import { useAlertStore } from 'src/stores/alert-store';
import {
  type AnswerKey,
  type AnswerKeyForm,
  EmptyKey,
  useAnswerKeyStore2,
} from 'src/stores/answer-key';
import { useAnswerSheetStore } from 'src/stores/answer-sheet';
import { computed, onBeforeMount, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  id: number | string;
}>();

const $q = useQuasar();
const router = useRouter();
const alertStore = useAlertStore();
const answerKeyStore = useAnswerKeyStore2();
const answerSheet = useAnswerSheetStore();

const answerKey = computed<AnswerKey>(
  (): AnswerKey => answerKeyStore.getAnswerKey(Number(props.id)) || EmptyKey,
);

const model = ref(answerKey.value as AnswerKeyForm);
const loading = ref<boolean>(false);

const tests = computed(() => model.value.context?.tests || []);

watch(
  () => answerKeyStore.list,
  () => {
    model.value = {
      ...model.value,
      ...answerKey.value,
    };
  },
  { deep: true },
);

const getTotalPoints = (items: TestItem[], test: Test) => {
  const total = items.reduce((total, item) => total + (Number(item?.points) || 0), 0);
  test.max_points = total;
  return total;
};

onBeforeMount(async () => {
  const id = Number(props.id);

  if (id) {
    try {
      if (answerKeyStore.buffer?.id == id) {
        // populate temp data
        model.value = {
          ...model.value,
          ...answerKeyStore.buffer,
        };
      } else {
        loading.value = true;
      }

      const data = await answerKeyStore.fetchFullDetails(id);

      if (!data) {
        return;
      }

      answerKeyStore.buffer = data; // store for the next visit

      model.value = {
        ...model.value,
        ...data,
      };
    } finally {
      loading.value = false;
    }
  }
});

onUnmounted(() => {
  answerKeyStore.cancelAll();
});

const scanNow = async (): Promise<void> => {
  answerSheet.form.answerKey = answerKey.value;
  answerSheet.form.subject = answerKey.value.subject;
  await router.push({ name: 'Scan Answer Sheets' });
};

const deleteAnswerKey = (): void => {
  $q.dialog({
    title: 'Delete?',
    message: "You won't be able to use this answer key further.",
    cancel: true,
    ok: 'Yes',
  }).onOk(() => {
    answerKeyStore
      .archive(answerKey.value.id)
      .then(async () => {
        await router.push({ name: 'Dashboard' });
      })
      .catch(skip);
  });
};

const saveChanges = (): void => {
  $q.dialog({
    title: 'Save Changes?',
    message:
      "If there are changes to the documents, you'll need to re-run the analysis to sync it with the updated data.",
    cancel: true,
    ok: 'Yes',
  }).onOk(() => {
    answerKeyStore
      .update(model.value, props.id)
      .then((data) => {
        model.value = { ...model.value, ...data };
        alertStore.Swap({ type: 'positive', message: 'Successfully saved.' });
      })
      .catch(skip);
  });
};

const reRunAnalysis = () => {
  $q.dialog({
    title: 'Re-run Analysis?',
    message: 'This will replace the existing analysis. You may need to review it again afterward.',
    cancel: true,
    ok: 'Yes',
  }).onOk(() => {
    loading.value = true;

    answerKeyStore
      .reanalyze(props.id)
      .then((data) => {
        model.value = { ...model.value, ...data };
        alertStore.Swap({ type: 'positive', message: 'Analysis has been successful.' });
      })
      .catch(skip)
      .finally(() => {
        loading.value = false;
      });
  });
};
</script>

<style>
.analysis-test {
  input,
  textarea {
    font-size: 0.75rem !important;
  }
}
</style>
