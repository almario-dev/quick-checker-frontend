<template>
  <q-dialog v-model="dialogModel" full-width>
    <q-card>
      <q-card-section>
        <Title title="Select Answer Key" dialog />
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <p v-if="!answerKeys.length" class="text-center p-4 text-italic text-grey-8">
          No answer keys found{{ subject ? ' for the selected subject' : '' }}.
        </p>

        <q-list separator>
          <q-item
            v-for="answerKey in answerKeys"
            :key="answerKey.id"
            :class="[
              'q-pl-xs',
              {
                'bg-grey-11': answerKey.id === props.answerKey?.id,
              },
            ]"
            clickable
            v-ripple
            @click="select(answerKey.id)"
          >
            <q-item-section avatar class="q-pa-none">
              <q-avatar rounded size="3rem" color="grey-11">
                <q-img src="src/assets/test.png" width="50%" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1" class="font-[500]">
                {{ answerKey.name }}
              </q-item-label>
              <q-item-label caption class="flex items-center gap-x-2 flex-wrap">
                <span> {{ answerKey.subject.name }} </span>
                <q-separator vertical />
                <span>Total Points: {{ answerKey.score ?? 0 }}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section side v-if="answerKey.id === props.answerKey?.id">
              <q-item-label caption>
                <q-icon name="check" size="xs" color="positive" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="grey-8" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Title } from '..';
import type { Subject } from 'src/composables/interfaces/IApp';
import { type AnswerKey, useAnswerKeyStore } from 'src/stores/answer-key-store';
import { useAlertStore } from 'src/stores/alert-store';

const alertStore = useAlertStore();
const answerKeyStore = useAnswerKeyStore();

const props = withDefaults(
  defineProps<{
    dialog: boolean;
    subject?: Subject | null;
    answerKey?: AnswerKey | null;
  }>(),
  {
    dialog: false,
    subject: null,
  },
);

const emit = defineEmits<{
  (e: 'update:dialog', value: boolean): void;
  (e: 'update:subject', value: Subject | null): void;
  (e: 'update:answerKey', value: AnswerKey | null): void;
  (e: 'select', value: AnswerKey): void;
}>();

const dialogModel = computed({
  get: () => props.dialog,
  set: (v) => emit('update:dialog', v),
});

const answerKeys = computed(() => {
  if (!props.subject) {
    return answerKeyStore.getList;
  }

  return answerKeyStore.getList.filter((a) => a.subject.id === props.subject?.id);
});

const select = async (key: number): Promise<void> => {
  try {
    const result = await answerKeyStore.fetchFullDetails(key);

    if (!result) {
      throw new Error();
    }

    // if no subject has been selected before, follow the answer key's
    if (!props.subject) {
      emit('update:subject', result.subject);
    }

    emit('update:answerKey', result);
    emit('update:dialog', false);
  } catch {
    alertStore.Swap({
      type: 'negative',
      message: 'Unable to fetch answer key data. Please try again or select a different one.',
    });
  }
};
</script>
