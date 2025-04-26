import { Camera, CameraResultType } from '@capacitor/camera';

export const base64ToBlob = (base64: string, contentType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i += 512) {
    const slice = byteCharacters.slice(i, i + 512);

    const byteNumbers = new Array(slice.length);
    for (let j = 0; j < slice.length; j++) {
      byteNumbers[j] = slice.charCodeAt(j);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

export const formatBlobSize = (blob: Blob): string => {
  const bytes = blob.size;

  if (bytes < 1024 * 1024) {
    // Less than 1MB, show in KB
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  // 1MB or more, show in MB
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const takePicture = async (): Promise<Blob> => {
  const image = await Camera.getPhoto({
    quality: 90,
    resultType: CameraResultType.Base64,
  });

  if (!image.base64String) {
    throw new Error('PARSING_ERROR');
  }

  const blob = base64ToBlob(image.base64String, `image/${image.format}`);

  return blob;
};

export const blobToImageUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};
