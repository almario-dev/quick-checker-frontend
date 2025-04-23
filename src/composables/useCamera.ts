import { ref } from 'vue';

const videoElement = ref<HTMLVideoElement | null>(null);
const stream = ref<MediaStream | null>(null);
export const devices = ref<MediaDeviceInfo[]>([]);

export const setVideoElement = (el: HTMLVideoElement) => {
  videoElement.value = el;
};

export const start = async (deviceId: string): Promise<void> => {
  // Stop any existing stream
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
  }

  const constraints = {
    video: {
      deviceId: { exact: deviceId },
    },
  };

  try {
    const newStream = await navigator.mediaDevices.getUserMedia(constraints);
    stream.value = newStream;

    if (videoElement.value) {
      videoElement.value.srcObject = newStream;
      await videoElement.value.play();
    }
  } catch (err) {
    console.error('Error accessing camera:', err);
    throw err;
  }
};

export const getDevices = async (): Promise<MediaDeviceInfo[]> => {
  await navigator.mediaDevices.getUserMedia({ video: true }); // Prompt for permission

  const mediaDevices = await navigator.mediaDevices.enumerateDevices();

  devices.value = mediaDevices.filter((d) => d.kind === 'videoinput');

  return devices.value;
};

// Helper to check if device is working
async function isDeviceWorking(id: string): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: id } },
    });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
}

export async function findWorkingDevice(deviceId: string): Promise<MediaDeviceInfo | null> {
  // Check if the passed deviceId is working
  if (await isDeviceWorking(deviceId)) {
    return devices.value.find((d) => d.deviceId === deviceId) ?? null;
  }

  // If not, find the first working one in the array
  for (const device of devices.value) {
    if (await isDeviceWorking(device.deviceId)) {
      return device;
    }
  }

  return null; // No working device found
}
