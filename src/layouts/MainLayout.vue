<template>
  <q-layout view="lHh LpR fFf" class="text-blue-grey-10 layout-with-bg">
    <div class="animated-bg"></div>

    <q-header reveal :reveal-offset="1" class="bg-transparent">
      <q-toolbar class="flex items-center">
        <q-btn
          v-if="pageTitle !== 'Dashboard'"
          icon="arrow_back"
          dense
          round
          flat
          color="grey-7"
          @click="back"
        />
        <Title v-if="pageTitle !== 'Dashboard'" :title="pageTitle" class="grow" />
        <q-btn icon="more_vert" text-color="grey-8" round flat class="q-ml-auto">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-pull-to-refresh @refresh="refresh">
        <router-view />
      </q-pull-to-refresh>
    </q-page-container>

    <q-footer class="bg-white text-dark" elevated>
      <div class="flex justify-between bg-white text-primary h-[3.5rem] bottom-nav">
        <q-btn
          exact
          :color="route.name === 'Dashboard' ? 'blue-grey-5' : 'primary'"
          :to="{ name: 'Dashboard' }"
          flat
          icon="home"
          class="flex-1"
          square
          :loading="disabled"
          :disable="disabled"
        />
        <q-btn
          exact
          :to="{ name: 'Recents' }"
          :color="route.name === 'Recents' ? 'blue-grey-5' : 'primary'"
          flat
          icon="manage_search"
          class="flex-1"
          square
          :loading="disabled"
          :disable="disabled"
        />

        <q-btn
          icon="document_scanner"
          class="shadow-9 scan-btn"
          glossy
          color="secondary"
          text-color="white"
          round
          @click="scanStore.scanNow"
          :disable="disabled"
        />

        <q-btn
          exact
          :to="{ name: 'Profile' }"
          :color="route.name === 'Profile' ? 'blue-grey-5' : 'primary'"
          flat
          icon="person"
          class="flex-1"
          square
          :loading="disabled"
          :disable="disabled"
        />
        <q-btn
          exact
          :to="{ name: 'Profile' }"
          :color="route.name === 'Profile' ? 'blue-grey-5' : 'primary'"
          flat
          icon="settings"
          class="flex-1"
          square
          :loading="disabled"
          :disable="disabled"
        />
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { skip } from 'src/assets/utils';
import { Title } from 'src/components';
import { useAlertStore } from 'src/stores/alert-store';
import { useAnswerKeyStore } from 'src/stores/answer-key-store';
import { useAnswerSheetStore } from 'src/stores/answer-sheet-store';
import { useAuthStore } from 'src/stores/auth-store';
import { useScanStore } from 'src/stores/scan-store';
import { useSubjectStore } from 'src/stores/subject-store';
import { useUserStore } from 'src/stores/user-store';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const $q = useQuasar();
const authStore = useAuthStore();
const userStore = useUserStore();
const alertStore = useAlertStore();
const scanStore = useScanStore();
const answerSheetStore = useAnswerSheetStore();
const answerKeyStore = useAnswerKeyStore();
const subjectStore = useSubjectStore();

const router = useRouter();
const route = useRoute();

const disabled = computed(() => !userStore.isAuthenticated);

const pageTitle = computed(() => {
  return typeof route.name === 'string' ? route.name : String(route.name ?? '');
});

const logout = (): void => {
  $q.dialog({
    title: 'Logout?',
    message: 'You will be redirected back to the login page',
    cancel: true,
  }).onOk(() => {
    authStore
      .logout()
      .then(() => {
        subjectStore.resetState();
        answerSheetStore.resetState();
        answerKeyStore.resetState();
        scanStore.resetState();

        router.push({ name: 'Guest' }).catch(skip);
      })
      .catch(() => {
        alertStore.Stack({ type: 'negative', message: 'Fail to logout' });
      });
  });
};

const refresh = async (done: () => void): Promise<void> => {
  try {
    subjectStore.cancelAll();
    answerSheetStore.cancelAll();

    await authStore.refresh();
    await Promise.all([subjectStore.init(), answerKeyStore.fetch(), answerSheetStore.init()]);
    done();
  } catch (error) {
    console.error('Task has failed: ', error);
  }
};

const back = (): void => router.go(-1);
</script>

<style lang="scss">
.bottom-nav {
  button:not(.scan-btn) {
    height: 100%;
  }

  .scan-btn {
    --size: 4.5rem;
    z-index: 10;
    font-size: 1rem;
    margin-top: -2.25rem;
    width: var(--size);
    height: var(--size);
  }
}
</style>
