import { defineStore } from 'pinia';
import { Notify, type QNotifyCreateOptions, type QNotifyUpdateOptions } from 'quasar';
import { ref } from 'vue';

export type AlertNotifyType = ((props?: QNotifyUpdateOptions) => void) | null;

export const useAlertStore = defineStore('alert', () => {
  const notifComponent = ref<AlertNotifyType>(null);

  const notify = (
    props: QNotifyCreateOptions | QNotifyUpdateOptions,
    replace?: boolean,
  ): AlertNotifyType => {
    const mode = replace ?? false;

    if (mode && notifComponent.value !== null) {
      notifComponent.value(); // dismiss the previous notify component
    }

    notifComponent.value = Notify.create(props);

    return notifComponent.value;
  };

  const Stack = (props: QNotifyCreateOptions | QNotifyUpdateOptions) => notify(props, false);

  const Swap = (props: QNotifyCreateOptions | QNotifyUpdateOptions) => notify(props, true);

  return {
    notifComponent,
    notify: Notify,
    Stack,
    Swap,
  };
});
