<template>
  <q-layout view="lHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar> Q.ai </q-avatar>
          Quick Checker
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left">
      <h6>current user: {{ name }}</h6>
      <q-btn label="logout" color="grey-7" @click="logout" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
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
