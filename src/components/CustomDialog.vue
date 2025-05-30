<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :persisten="persistent">
    <q-card class="full-width max-w-sm rounded-2xl">
      <q-card-section class="text-center">
        <div
          v-if="icon"
          class="w-16 h-16"
          :class="iconBg + ' rounded-full flex items-center justify-center mx-auto'"
        >
          <q-icon :name="icon" :class="iconClass" size="2rem" />
        </div>

        <div class="my-8">
          <div class="text-lg font-semibold text-gray-800 mb-2">{{ title }}</div>
          <p class="text-gray-600 text-sm" v-if="message">
            {{ message }}
          </p>
          <slot />
        </div>

        <div class="flex flex-col items-center">
          <q-btn
            v-if="okLabel"
            class="bg-gradient-purplish full-width rounded-xl font-medium q-mb-sm"
            text-color="white"
            :label="okLabel"
            no-caps
            :loading="okLoading"
            @click="onDialogOK"
          />
          <q-btn
            v-if="cancelLabel"
            flat
            :label="cancelLabel"
            class="w-full text-gray-600"
            no-caps
            @click="onDialogCancel"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { type DialogOptions } from 'src/composables/usePopup';

withDefaults(defineProps<DialogOptions>(), {
  icon: null,
  iconBg: 'bg-blue-100',
  iconClass: 'text-blue-600',
  title: '',
  message: '',
  okLabel: 'OK',
  cancelLabel: '',
  okLoading: false,
  persistent: false,
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
</script>
