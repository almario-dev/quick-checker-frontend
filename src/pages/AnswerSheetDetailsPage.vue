<template>
  <q-page class="p-6 pb-2 bg-white">
    <AnswerSheetSetup no-footer v-model="answerSheet" @submit="answerSheetStore.quickCheck">
      <div class="mb-1">
        <Title title="Analysis" dialog />
      </div>

      <q-card v-for="(test, tIndex) in context?.tests || []" :key="tIndex" class="q-mb-md">
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
                    label="Item No."
                    type="number"
                    dense
                  />
                </div>
                <div class="col q-pl-md">
                  <q-input
                    lazy-rules
                    :rules="createRules({ max: Number(item.points) })"
                    filled
                    v-model="item.points_awarded as number"
                    :max="item.points"
                    :label="`Points / ${item.points}`"
                    type="number"
                    dense
                    @update:model-value="(v) => updateScore(v, item)"
                  />
                </div>

                <div class="col-2 q-pl-md">
                  <q-checkbox
                    size="xs"
                    class="q-ma-none"
                    :color="item.is_correct ? 'positive' : 'negative'"
                    v-model="item.is_correct"
                    @update:model-value="(v) => updateCheck(v, item)"
                  />
                </div>
              </div>

              <q-input
                lazy-rules
                :rules="createRules({ required: true })"
                filled
                v-model="item.key as string"
                label="Answer"
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
    </AnswerSheetSetup>
  </q-page>
</template>

<script setup lang="ts">
import { AnswerSheetSetup, Title } from 'src/components';
import type { Context, Test, TestItem } from 'src/composables/interfaces/IApp';
import { createRules } from 'src/composables/useRules';
import { useAnswerKeyStore2 } from 'src/stores/answer-key';
import { type AnswerSheetRaw, EmptySheet, useAnswerSheetStore } from 'src/stores/answer-sheet';
import { onBeforeMount, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  id: string;
}>();

const answerKeyStore = useAnswerKeyStore2();
const answerSheetStore = useAnswerSheetStore();

const answerSheet = ref<AnswerSheetRaw>({ ...EmptySheet });
const context = ref<Context | null>(null);

const syncData = async (): Promise<void> => {
  const data = answerSheetStore.getList.find((s) => props.id == s.id) || ({} as AnswerSheetRaw);

  answerSheet.value.id = props.id;

  answerSheet.value.studentName = data?.studentName || '';
  answerSheet.value.subject = data?.subject || null;
  answerSheet.value.aiChecked = data?.aiChecked || false;
  answerSheet.value.documents = data?.documents || [];

  if (data?.answerKey != null) {
    answerSheet.value.answerKey =
      typeof data.answerKey === 'number'
        ? answerKeyStore.getAnswerKey(data.answerKey) || null
        : data.answerKey;
  }

  if (data?.createdAt) {
    const data = await answerSheetStore.getInfo(Number(props.id));
    answerSheet.value.documents = data?.documents || [];
    context.value = data?.context || null;
  }
};

const getTotalPoints = (items: TestItem[], test: Test) => {
  const total = items.reduce((total, item) => total + Number(item?.points_awarded ?? 0), 0);
  test.points_acquired = total;
  return total;
};

const updateCheck = (v: boolean, item: TestItem) => {
  item.points_awarded = v ? item.points || 0 : 0;
};

const updateScore = (v: string | number | null, item: TestItem) => {
  item.is_correct = Number(v || 0) > 0;
};

watch(() => answerSheetStore.getList, syncData, { deep: true });

onBeforeMount(syncData);

onUnmounted(() => {
  answerSheetStore.resetForm();
});
</script>
