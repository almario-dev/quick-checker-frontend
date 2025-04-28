<template>
  <q-layout view="lHh LpR fFf" class="text-blue-grey-10 layout-with-bg">
    <div class="animated-bg"></div>

    <q-header reveal :reveal-offset="1" class="bg-transparent">
      <q-toolbar class="flex items-center">
        <Title v-if="pageTitle !== 'Dashboard'" :title="pageTitle" class="grow" />
        <q-btn icon="more_vert" text-color="grey-8" round flat class="q-ml-auto" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-pull-to-refresh @refresh="refresh">
        <router-view />
      </q-pull-to-refresh>
    </q-page-container>

    <q-footer class="bg-white text-dark">
      <div class="grid grid-rows-1 grid-cols-4 bottom-nav">
        <div class="col-span-3">
          <q-tabs class="bg-primary text-white" indicator-color="transparent" align="justify">
            <q-route-tab exact :to="{ name: 'Dashboard' }" icon="home" />
            <q-route-tab exact :to="{ name: 'Profile' }" icon="person" />
            <q-route-tab exact :to="{ name: 'Recents' }" icon="manage_search" />
          </q-tabs>
        </div>
        <div class="scan-btn-wrapper">
          <q-btn
            icon="document_scanner"
            class="scan-btn bg-primary"
            flat
            text-color="white"
            @click="scanStore.scanNow"
          />
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
/* eslint-disable */
import { useQuasar } from 'quasar';
import { Title } from 'src/components';
import { useAuthStore } from 'src/stores/auth-store';
import { useScanStore } from 'src/stores/scan-store';
import { useSubjectStore } from 'src/stores/subject-store';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $q = useQuasar();
const authStore = useAuthStore();
const subjectStore = useSubjectStore();
const scanStore = useScanStore();

const router = useRouter();
const route = useRoute();

const pageTitle = computed(() => {
  return typeof route.name === 'string' ? route.name : String(route.name ?? '');
});

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

function refresh() {
  location.reload();
}
</script>

<style lang="scss">
.bottom-nav {
  // display: flex;
  // align-items: end;

  .scan-btn-wrapper {
    height: 100%;
    position: relative;
  }

  .scan-btn {
    position: absolute;
    --size: 5rem;
    // width: var(--size);
    width: 100%;
    height: var(--size);
    bottom: 0;
    right: 0rem;
  }
}
</style>
