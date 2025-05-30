<template>
  <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
    <div class="flex items-center justify-center mb-6">
      <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
        <q-icon name="person_add" class="text-purple-600 text-lg" />
      </div>
      <div class="text-xl font-semibold text-gray-800">Create Account</div>
    </div>

    <q-form @submit.prevent="onRegister" class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <q-input
            v-model="registerForm.firstname"
            placeholder="John"
            outlined
            class="w-full"
            :rules="[(val) => !!val || 'First name is required']"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <q-input
            v-model="registerForm.lastname"
            placeholder="Doe"
            outlined
            class="w-full"
            :rules="[(val) => !!val || 'Last name is required']"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <q-input
          v-model="registerForm.email"
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
          v-model="registerForm.password"
          :type="showRegisterPassword ? 'text' : 'password'"
          placeholder="Create a strong password"
          outlined
          class="w-full"
          :rules="[
            (val) => !!val || 'Password is required',
            (val) => val.length >= 8 || 'Password must be at least 8 characters',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="lock" class="text-gray-400" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showRegisterPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer text-gray-400"
              @click="showRegisterPassword = !showRegisterPassword"
            />
          </template>
        </q-input>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
        <q-input
          v-model="registerForm.password_confirmation"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Confirm your password"
          outlined
          class="w-full"
          :rules="[
            (val) => !!val || 'Please confirm your password',
            (val) => val === registerForm.password || 'Passwords do not match',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="lock" class="text-gray-400" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer text-gray-400"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </template>
        </q-input>
      </div>

      <div class="pt-2">
        <q-checkbox v-model="registerForm.terms" class="text-sm text-gray-600">
          <span class="ml-2">
            I agree to the
            <a href="#" class="text-blue-600 hover:text-blue-800 font-medium">Terms of Service</a>
            and
            <a href="#" class="text-blue-600 hover:text-blue-800 font-medium">Privacy Policy</a>
          </span>
        </q-checkbox>
      </div>

      <q-btn
        type="submit"
        label="Create Account"
        color="primary"
        class="full-width q-py-md rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        no-caps
        :loading="registerLoading"
        :disable="registerLoading || !registerForm.terms"
      />
    </q-form>

    <div class="flex items-center text-center mt-6">
      <span class="text-sm text-gray-600">Already have an account?</span>
      <q-btn
        :to="{ name: 'Login' }"
        label="Login Here"
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
import type { RegisterForm } from 'src/types/auth';
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

// Register form data
const registerForm = ref<RegisterForm>({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  password_confirmation: '',
  terms: false,
});

const showRegisterPassword = ref<boolean>(false);
const showConfirmPassword = ref<boolean>(false);

const registerLoading = ref<boolean>(false);

const resetForm = () => {
  registerForm.value = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
  };
};

const onRegister = async (): Promise<void> => {
  if (!registerForm.value.terms) {
    return;
  }

  registerLoading.value = true;

  try {
    await auth.register(registerForm.value);
    await router.push({ name: 'Auth' });
    await new Promise(() => setTimeout(resetForm, 1000));
  } finally {
    registerLoading.value = false;
  }
};
</script>
