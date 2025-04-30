<template>
  <q-page class="q-pa-md">
    <q-form @submit.prevent="submit">
      <q-card>
        <q-card-section>
          <q-item class="q-pa-none">
            <q-item-section>
              <q-item-label class="font-[600]">Similarity Threshold (Essay-type)</q-item-label>
              <q-item-label caption>
                Adjusts the strictness of answer evaluation based on similarity.
              </q-item-label>

              <q-item-label>
                <div class="text-right">{{ model.similarity_threshold }}%</div>
                <q-slider
                  color="teal"
                  v-model="model.similarity_threshold"
                  :min="0"
                  :max="100"
                  :step="1"
                />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>

      <div class="mt-6 flex justify-center">
        <q-btn
          type="submit"
          padding="0.5rem 1rem"
          color="primary"
          label="Save changes"
          :disable="disableBtn"
          :loading="isSubmitting"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { skip } from 'src/assets/utils';
import { type AppSettings, useUserStore } from 'src/stores/user-store';
import { computed, reactive, ref } from 'vue';

const $q = useQuasar();
const userStore = useUserStore();

const model = reactive<AppSettings>({ ...userStore.settings });
const isSubmitting = ref<boolean>(false);

const hasChanged = computed(() => JSON.stringify(model) !== JSON.stringify(userStore.settings));
const disableBtn = computed(() => !hasChanged.value || isSubmitting.value);

const submit = (): void => {
  if (!hasChanged.value) return;

  $q.dialog({
    title: 'Save Changes?',
    message: 'Please confirm action to proceed',
    cancel: true,
  }).onOk(() => {
    isSubmitting.value = true;

    userStore
      .saveSettings(model)
      .catch(skip)
      .finally(() => {
        isSubmitting.value = false;
      });
  });
};
</script>
