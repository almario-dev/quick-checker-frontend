<template>
  <q-page class="flex column items-center justify-center">
    <q-form class="q-gutter-y-sm" @submit.prevent="submit" autofocus>
      <div class="text-h6">Register</div>
      <q-input v-model="form.name" label="Name" outlined lazy-rules :rules="rules.name" />
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
        type="password"
        outlined
        lazy-rules
        :rules="rules.password"
      />
      <q-input
        v-model="form.password_confirmation"
        label="Confirm Password"
        type="password"
        outlined
        lazy-rules
        :rules="rules.password_confirmation"
      />

      <q-btn
        type="submit"
        class="full-width"
        label="Submit"
        color="primary"
        :loading="isSubmitting"
        :disable="isSubmitting"
      />
    </q-form>

    <div class="text-center q-mt-lg">
      Already have an account?
      <br />
      <q-btn label="Login here" color="secondary" no-caps dense flat :to="{ name: 'Login' }" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import type { IUserRegistration } from 'src/composables/interfaces/IUser';
import { createRules } from 'src/composables/useRules';
import { useAuthStore } from 'src/stores/auth-store';
import { computed, reactive, ref } from 'vue';

const $q = useQuasar();
const authStore = useAuthStore();
const isSubmitting = ref<boolean>(false);

const form = reactive<IUserRegistration>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

const rules = computed(() => ({
  name: createRules({ required: true }),
  email: createRules({ required: true, email: true }),
  password: createRules({ required: true, min: '6' }),
  password_confirmation: createRules({
    required: true,
    custom: () => form.password === form.password_confirmation || 'Password do not match',
  }),
}));

const resetForm = (): void => {
  form.name = '';
  form.email = '';
  form.password = '';
  form.password_confirmation = '';
};

const submit = (): void => {
  isSubmitting.value = true;

  authStore
    .register(form)
    .then(() => {
      $q.notify({ type: 'positive', message: 'You have successfully created an account!' });
      resetForm();
    })
    .catch((err) => {
      const message = err?.response?.data?.message || 'Registration failed';

      $q.notify({ type: 'negative', message });
      console.error(err);
    })
    .finally(() => (isSubmitting.value = false));
};
</script>
