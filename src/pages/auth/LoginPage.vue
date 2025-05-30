<template>
  <!-- Login Form -->
  <div class="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
    <div class="flex items-center justify-center mb-6">
      <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
        <q-icon name="login" class="text-green-600 text-lg" />
      </div>
      <div class="text-xl font-semibold text-gray-800">Sign In</div>
    </div>

    <q-form @submit="onLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <q-input
          v-model="loginForm.email"
          type="email"
          placeholder="teacher@school.edu"
          outlined
          class="w-full"
          :rules="[(val) => !!val || 'Email is required']"
        >
          <template v-slot:prepend>
            <q-icon name="email" class="text-gray-400" />
          </template>
        </q-input>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <q-input
          v-model="loginForm.password"
          :type="showLoginPassword ? 'text' : 'password'"
          placeholder="Enter your password"
          outlined
          class="w-full"
          :rules="[(val) => !!val || 'Password is required']"
        >
          <template v-slot:prepend>
            <q-icon name="lock" class="text-gray-400" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showLoginPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer text-gray-400"
              @click="showLoginPassword = !showLoginPassword"
            />
          </template>
        </q-input>
      </div>

      <div class="flex items-center justify-between">
        <a href="#" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Forgot Password?
        </a>
      </div>

      <q-btn
        type="submit"
        label="Sign In"
        color="primary"
        class="full-width q-py-md rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        no-caps
        :loading="loginLoading"
      />
    </q-form>

    <div class="flex items-center text-center mt-6">
      <span class="text-sm text-gray-600">Don't have an account?</span>
      <q-btn
        :to="{ name: 'Register' }"
        label="Create here"
        flat
        no-caps
        class="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors ml-1"
        unelevated
        padding=""
        color="primary"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { LoginForm } from 'src/types/auth';
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

// Login form data
const loginForm = ref<LoginForm>({
  email: '',
  password: '',
});

// Password visibility toggles
const showLoginPassword = ref<boolean>(false);

// Loading states
const loginLoading = ref<boolean>(false);

// Form submission handlers
const onLogin = async (): Promise<void> => {
  try {
    loginLoading.value = true;

    await auth.login(loginForm.value);
    await router.push({ name: 'Auth' });
    await new Promise(() =>
      setTimeout(() => {
        loginForm.value = {
          email: '',
          password: '',
        };
      }, 1000),
    );
  } finally {
    loginLoading.value = false;
  }
};
</script>
