<template>
  <q-page class="flex column items-center justify-center">
    <q-form class="q-gutter-y-sm" autofocus @submit.prevent="submit">
      <div class="text-h6">Login</div>
      <q-input
        v-model="form.email"
        label="Email Address"
        outlined
        lazy-rules
        :rules="rules.email"
      />
      <q-input
        v-model="form.password"
        label="Password"
        outlined
        lazy-rules
        :rules="rules.password"
      />

      <q-btn type="submit" label="Login" color="primary" :loading="loading" :disable="loading" />
    </q-form>

    <div class="text-center q-mt-lg">
      No account yet?
      <br />
      <q-btn
        label="Create new account"
        color="secondary"
        no-caps
        dense
        flat
        :to="{ name: 'Register' }"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import type { IUserLogin } from 'src/composables/interfaces/IUser';
import { createRules } from 'src/composables/useRules';
import { useAuthStore } from 'src/stores/auth-store';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const loading = ref<boolean>(false);

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
