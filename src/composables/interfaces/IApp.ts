export interface AlertDialogConfig {
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  after?: number;
  onOk?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
}

export interface Subject {
  id: number;
  name: string;
}

export interface ChangePassword {
  old_password: string;
  password: string;
  password_confirmation: string;
}

export interface FileUpload {
  id: number;
  path: string;
}

export type TestItem = {
  points?: number;
  item_number: number | string;
} & Record<string, number | string>;

export interface Test {
  title: string;
  max_points: number;
  items?: TestItem[];
}

export interface Context {
  total_points: number;
  tests: Test[];
}
