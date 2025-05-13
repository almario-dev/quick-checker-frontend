export type LocalFileType = { id: string; file: Blob } & Record<string, unknown>;

export type IndeterminateData = string | number | boolean | object | null;

export type FileType = {
  id: number;
  blob?: Blob; // blob object
  path?: string; // for path or image data
} & Record<string, unknown>;
