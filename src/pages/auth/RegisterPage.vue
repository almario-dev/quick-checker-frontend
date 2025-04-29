<template>
  <q-page class="p-6 column items-stretch justify-center">
    <q-form class="q-gutter-y-sm" autofocus @submit.prevent="submit">
      <div class="text-center column mb-8 items-center justify-center">
        <AppLogo size="md" />
        <span class="text-[1.5rem] font-[600] text-primary">Quick Checker</span>
        <span class="text-[1rem] text-blue-grey-8 mt-2">Register</span>
      </div>
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
        :type="showPassword ? 'text' : 'password'"
        outlined
        lazy-rules
        :rules="rules.password"
      >
        <template v-if="form.password || form.password_confirmation" v-slot:append>
          <q-btn
            :icon="showPassword ? 'visibility_off' : 'visibility'"
            dense
            flat
            color="grey-6"
            @click="showPassword = !showPassword"
          />
        </template>
      </q-input>
      <q-input
        v-model="form.password_confirmation"
        label="Confirm Password"
        :type="showPassword ? 'text' : 'password'"
        outlined
        lazy-rules
        :rules="rules.password_confirmation"
      >
        <template v-if="form.password || form.password_confirmation" v-slot:append>
          <q-btn
            :icon="showPassword ? 'visibility_off' : 'visibility'"
            dense
            flat
            color="grey-6"
            @click="showPassword = !showPassword"
          />
        </template>
      </q-input>

      <q-btn
        type="submit"
        class="full-width"
        padding="md"
        label="Create account"
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
import AppLogo from 'src/components/AppLogo.vue';
import type { IUserRegistration } from 'src/composables/interfaces/IUser';
import { createRules } from 'src/composables/useRules';
import { useAuthStore } from 'src/stores/auth-store';
import { computed, reactive, ref } from 'vue';

const $q = useQuasar();
const authStore = useAuthStore();
const isSubmitting = ref<boolean>(false);
const showPassword = ref<boolean>(false);

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
