<template>
  <q-page class="p-6 column items-stretch justify-center">
    <q-form
      class="bg-white p-5 pt-0 rounded-lg shadow-6 q-gutter-y-sm"
      autofocus
      @submit.prevent="submit"
    >
      <div class="text-center column mb-8 items-center justify-center">
        <AppLogo size="md" />
        <span class="text-[1.5rem] font-[600] text-primary">Quick Checker</span>
        <span class="text-[1rem] text-blue-grey-8 mt-2">Login to your account</span>
      </div>
      <q-input
        v-model="form.email"
        label="Email Address"
        outlined
        lazy-rules
        :rules="rules.email"
      />
      <q-input
        v-model="form.password"
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        outlined
        lazy-rules
        :rules="rules.password"
      >
        <template v-if="form.password" v-slot:append>
          <q-btn
            :icon="showPassword ? 'visibility_off' : 'visibility'"
            flat
            round
            dense
            color="grey-6"
            @click="showPassword = !showPassword"
          />
        </template>
      </q-input>

      <q-btn
        type="submit"
        class="full-width q-mt-md"
        padding="md"
        label="Login"
        color="primary"
        :loading="loading"
        :disable="loading"
      />

      <div class="text-center q-mt-lg">
        No account yet?
        <q-btn label="Create here" color="info" no-caps dense flat :to="{ name: 'Register' }" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import AppLogo from 'src/components/AppLogo.vue';
import type { IUserLogin } from 'src/composables/interfaces/IUser';
import { createRules } from 'src/composables/useRules';
import { useAuthStore } from 'src/stores/auth-store';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const loading = ref<boolean>(false);
const showPassword = ref<boolean>(false);

const rules = {
  email: createRules({ required: true }),
  password: createRules({ required: true }),
};

const form = reactive<IUserLogin>({
  email: '',
  password: '',
});

const submit = () => {
  loading.value = true;

  authStore
    .login(form)
    .then(async (): Promise<void> => {
      await router.push({ name: 'Dashboard' });
    })
    .catch((err) => {
      const message = err?.response?.data?.message || 'Unable to login with these credentials';

      $q.notify({ type: 'negative', message });
      console.error(err);
    })
    .finally(() => (loading.value = false));
};
</script>
