<template>
  <q-card v-for="(test, tIndex) in testsModel || []" :key="tIndex" class="q-mb-md">
    <q-card-section>
      <q-expansion-item
        header-class="q-pa-none q-py-none text-weight-bold"
        :label="getTestTitle(test)"
      >
        <div v-for="(item, iIndex) in test.items" :key="iIndex" class="analysis-test q-mt-sm">
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
            <template v-if="!answerKeyMode">
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
            </template>
            <div v-else class="col q-pl-md">
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
</template>

<script setup lang="ts">
import type { Test, TestItem } from 'src/composables/interfaces/IApp';
import { createRules } from 'src/composables/useRules';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    tests: Test[];
    answerKeyMode?: boolean;
  }>(),
  {
    tests: () => [],
    answerKeyMode: false,
  },
);

const emit = defineEmits<{
  (e: 'update:tests', value: Test[]): void;
}>();

const testsModel = computed({
  get: () => props.tests,
  set: (v) => emit('update:tests', v),
});

const getTotalPoints = (items: TestItem[], test: Test) => {
  const total = items.reduce(
    (total, item) =>
      total + Number(item ? (props.answerKeyMode ? item.points : (item.points_awarded ?? 0)) : 0),
    0,
  );

  if (props.answerKeyMode) {
    test.max_points = total;
  } else {
    test.points_acquired = total;
  }

  return total;
};

const getTestTitle = (test: Test) => {
  return test.title + ' (' + (getTotalPoints(test.items || [], test) || test.max_points) + ' pts)';
};

const updateCheck = (v: boolean, item: TestItem) => {
  item.points_awarded = v ? item.points || 0 : 0;
};

const updateScore = (v: string | number | null, item: TestItem) => {
  item.is_correct = Number(v || 0) > 0;
};
</script>
