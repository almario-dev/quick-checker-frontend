import type { AxiosError } from 'axios';
import type { LocalFileType } from 'src/composables/types/app';

export const getErrMessage = (err: AxiosError, fallback = ''): string => {
  const data = err.response?.data as { message?: string };
  return data?.message || fallback;
};

// function to skip catch blocks
export const skip = (): void => {};

export const newFileObject = (file: Blob, props: Record<string, unknown> = {}): LocalFileType => {
  return {
    id: 'u' + Date.now(),
    file,
    ...props,
  };
};

export const convertJSONToFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;

    if (value instanceof Blob || value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      formData.append(key, String(value));
    } else {
      console.warn(`Unsupported FormData value for key "${key}":`, value);
    }
  }

  return formData;
};
