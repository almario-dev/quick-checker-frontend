import { type EvaluationMode } from '../dictionary';

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

/** */
export interface Test {
  id: number;
  name: string;
  subject: Subject;
  mode: null | EvaluationMode;
}

export interface RawTest {
  name: string;
  subject: Subject | null;
}

export interface AnswerSheet {
  file: Blob;
  name: string | true; // the student's name
  id: string; // temporary unique id
}

/** */
