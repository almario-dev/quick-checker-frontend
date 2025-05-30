import {
  Dialog,
  Notify,
  type QNotifyCreateOptions,
  type QNotifyUpdateOptions,
  type QDialogOptions,
} from 'quasar';
import CustomDialog from 'src/components/CustomDialog.vue';
import { ref } from 'vue';

export interface DialogOptions {
  icon?: string | null;
  iconBg?: string;
  iconClass?: string;
  title?: string;
  message?: string;
  okLabel?: string;
  cancelLabel?: string;
  okLoading?: boolean;
  persistent?: boolean;
}

export type CustomNotify = ((props?: QNotifyUpdateOptions) => void) | null;

const notifyBuffer = ref<CustomNotify>(null);

export const dialog = (options: QDialogOptions & DialogOptions): Promise<string> => {
  return new Promise((resolve) => {
    Dialog.create({
      component: CustomDialog,
      componentProps: options,
    })
      .onOk(() => resolve('ok'))
      .onCancel(() => resolve('cancel'))
      .onDismiss(() => resolve('dismiss'));
  });
};

export const notify = (
  props: QNotifyCreateOptions | QNotifyUpdateOptions,
  stacked: boolean = false, // for stacking alerts
): CustomNotify => {
  if (!stacked && notifyBuffer.value !== null) {
    notifyBuffer.value(); // dismiss the previous notify component
  }

  notifyBuffer.value = Notify.create(props);

  return notifyBuffer.value;
};
