<template>
  <q-page class="bg-whitexx p-5 gap-4 flex column">
    <div class="bg-white shadow-3 rounded-xl q-pa-md flex gap-3 items-center">
      <q-toggle v-model="scanStore.preferences.answerKeyMode" icon="spellcheck" color="blue-9" />

      <q-separator vertical />

      <div class="grow items-center flex gap-2">
        <i class="text-grey-7">No scanned doc(s)</i>

        <template v-if="false">
          <q-btn icon="description" round color="blue-8" unelevated />
          <q-btn icon="description" round color="blue-8" unelevated />
          <span class="text-grey-8">+3 more</span>
        </template>
      </div>

      <q-btn
        icon="more_vert"
        round
        color="primary"
        flat
        class="ml-auto"
        @click="preferencesDialog = true"
      />
    </div>

    <div class="grow rounded-xl scanner-container">
      <video
        ref="videoRef"
        autoplay
        muted
        playsinline
        class="absolute inset-0 object-cover w-full h-full z-0"
      />

      <div class="scanner-overlay q-pa-lg">
        <div class="scanner-frame">
          <div class="bottom-left"></div>
          <div class="bottom-right"></div>
          <span class="p-6 text-center text-white/80 text-[1rem] bg-black/20">
            Center the document on the screen
          </span>
        </div>
      </div>
    </div>

    <div class="bg-blue-9 rounded-xl q-pa-md grid grid-cols-6">
      <div class="flex items-center">
        <q-btn
          flat
          dense
          round
          class="bg-blue-10 text-blue-11 text-weight-regular"
          icon="chevron_left"
          @click="router.go(-1)"
        />
      </div>

      <div class="col-span-4 flex items-center justify-evenly">
        <q-btn icon="refresh" color="white" flat round />
        <q-btn icon="camera" color="white" flat round size="lg" @click="captureImage" />
        <q-btn icon="photo_library" color="white" flat round />
      </div>

      <div class="flex items-center">
        <q-btn
          flat
          dense
          no-caps
          rounded
          class="full-width text-center bg-blue-10 text-light-blue-1 text-weight-regular"
          label="Done"
          disable
        />
      </div>
    </div>
  </q-page>

  <Preferences v-model="preferencesDialog" :camera-options="cameraDevices" />
</template>

<script setup lang="ts">
/* eslint-disable */
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Preferences } from 'src/components';
import { useScanStore } from 'src/stores/scan-store';
import {
  getDevices,
  start,
  devices as cameraDevices,
  setVideoElement,
  findWorkingDevice,
} from 'src/composables/useCamera';
import { useAlertStore } from 'src/stores/alert-store';
import { Camera, CameraResultType } from '@capacitor/camera';

const router = useRouter();
const alertStore = useAlertStore();
const scanStore = useScanStore();

const preferencesDialog = ref<boolean>(false);
const videoRef = ref<HTMLVideoElement | null>(null);

const imageSrc = ref<string>('');

async function captureImage() {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri,
  });

  // The result will vary on the value of the resultType option.
  // CameraResultType.Uri - Get the result from image.webPath
  // CameraResultType.Base64 - Get the result from image.base64String
  // CameraResultType.DataUrl - Get the result from image.dataUrl
  console.log(image);

  // imageSrc.value = image.webPath;
}

onMounted(async () => {
  // Set the video element reference
  if (videoRef.value) {
    setVideoElement(videoRef.value);
  }

  // Get available cameras
  await getDevices();

  const currentCamera = scanStore.preferences.cameraDevice || null;

  if (currentCamera) {
    const { deviceId } = (await findWorkingDevice(currentCamera)) || {};

    if (!deviceId) {
      // no working camera has been found
      alertStore.Swap({ type: 'warning', message: `Unable to find a working camera` });
      return;
    }

    if (currentCamera === deviceId) {
      // the current preferred camera is working
      await start(currentCamera);
      return;
    }

    // switched to a working camera
    scanStore.preferences.cameraDevice = deviceId;
  }
});

// Watch for camera changes
watch(
  () => videoRef.value,
  (newRef) => {
    if (newRef) {
      setVideoElement(newRef);
    }
  },
);

watch(
  () => scanStore.preferences.cameraDevice,
  async (newValue, oldValue) => {
    if (newValue === oldValue) return;

    try {
      await start(newValue);

      const { label } = cameraDevices.value.find(({ deviceId }) => deviceId === newValue) || {};

      if (label) {
        alertStore.Swap({ message: `Switched to ${label}` });
      }
    } catch (err) {
      console.error(err);
      alertStore.Swap({ type: 'warning', message: `Could not start the camera device` });
    }
  },
);
</script>
