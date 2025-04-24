export interface AlertDialogConfig {
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  after?: number;
  onOk?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
}

export interface PreferencesProps {
  aiChecker: boolean;
  answerKeyMode: boolean;
  skipPreview: boolean;
  cameraDevice: string;
}

export interface Subject {
  id: number;
  name: string;
}
