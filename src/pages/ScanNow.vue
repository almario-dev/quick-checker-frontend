<template>
  <div>
    <q-btn label="camera" @click="takePicture" />

    <img :src="imageSrc" />
  </div>
</template>

<script setup lang="ts">
import { Camera, CameraResultType } from '@capacitor/camera';
import { ref } from 'vue';

const imageSrc = ref<string>('');

const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri,
  });

  // image.webPath will contain a path that can be set as an image src.
  // You can access the original file using image.path, which can be
  // passed to the Filesystem API to read the raw data of the image,
  // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  const imageUrl = image.webPath;

  // Can be set to the src of an image now
  imageSrc.value = imageUrl || '';
};
</script>
