import { defineStore } from 'pinia';
import type { QNotifyUpdateOptions } from 'quasar';
import { Notify } from 'quasar';
import type { PreferencesProps } from 'src/composables/interfaces/IApp';
import { nextTick, reactive, ref, watch } from 'vue';

export const useScanStore = defineStore(
  'scan',
  () => {
    const preferences = reactive<PreferencesProps>({
      aiChecker: false,
      answerKeyMode: false,
      skipPreview: false,
      cameraDevice: '',
    });

    const isHydrated = ref(false);
    const answerKeyModeHookNotif = ref<((props?: QNotifyUpdateOptions) => void) | null>(null);

    // Wait until hydration is complete
    nextTick(() => {
      isHydrated.value = true;
    }).catch(() => {});

    // Watch answerKeyMode change
    watch(
      () => preferences.answerKeyMode,
      (newValue) => {
        if (!isHydrated.value) return; // skip hydration changes

        if (answerKeyModeHookNotif.value !== null) {
          // dismiss previous notification
          answerKeyModeHookNotif.value();
        }

        const notif = Notify.create({
          type: newValue ? 'positive' : 'default',
          message: newValue ? 'Now scanning as answer keys.' : 'Answer key mode deactivated.',
          timeout: 5000,
        });

        if (typeof notif === 'function') {
          answerKeyModeHookNotif.value = notif;
        }
      },
    );

    return { preferences, isHydrated };
  },
  {
    persist: {
      pick: ['preferences'],
    },
  },
);
