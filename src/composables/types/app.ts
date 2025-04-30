export type LocalFileType = { id: string; file: Blob } & Record<string, unknown>;

export type IndeterminateData = string | number | boolean | object | null;
