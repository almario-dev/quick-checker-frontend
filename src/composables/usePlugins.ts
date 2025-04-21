import type { DialogChainObject, QDialogOptions } from 'quasar';
import type { AlertDialogConfig } from './interfaces/IApp';
import { Dialog } from 'quasar';

export function showAlertDialog(config: AlertDialogConfig): DialogChainObject {
  const { title, message, onOk, onCancel, onDismiss } = config;
  const options: QDialogOptions = {
    title: title || '',
    message: message,
    persistent: true,
  };

  if (onCancel) {
    options.cancel = true;
  }

  // if(type) {
  //   options.class = type;
  // }

  const dialog = Dialog.create(options);

  if (onOk) {
    dialog.onOk(onOk);
  }

  if (onCancel) {
    dialog.onCancel(onCancel);
  }

  if (onDismiss) {
    dialog.onDismiss(onDismiss);
  }

  return dialog;
}
