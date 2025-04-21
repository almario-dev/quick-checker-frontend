<template>
  <q-layout view="lHh lpR fFf">
    <q-page-container>
      <q-page class="flex column">
        <div>
          <router-view />
        </div>
        <q-tabs
          v-model="tab"
          dense
          class="bg-white shadow-2 rounded-borders"
          align="center"
          indicator-color="primary"
          bottom
        >
          <q-tab name="home" icon="home" label="Home" />
          <q-tab name="profile" icon="person" label="Profile" />
          <q-tab name="settings" icon="settings" label="Settings" />
        </q-tabs>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
/* eslint-disable */
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';
import { useUserStore } from 'src/stores/user-store';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();
const leftDrawerOpen = ref<boolean>(false);
const name = computed(() => userStore.getData?.name || '');

const tab = ref<string>('home');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
  $q.dialog({
    title: 'Do you really wish to logout?',
    message: 'You will be redirected back to the login page',
    cancel: true,
  }).onOk(() => {
    authStore
      .logout()
      .then(() => {
        // fuck eslint!!
        router.push({ name: 'Guest' }).catch(() => {});
      })
      .catch(() => {
        $q.notify({ type: 'negative', message: 'Fail to logout' });
      });
  });
}
</script>
