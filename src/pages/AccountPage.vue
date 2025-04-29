<template>
  <q-page class="q-pa-md q-gutter-lg">
    <q-card class="bg-transparent no-shadow">
      <q-card-section class="q-pa-none">
        <div class="flex justify-center mb-12">
          <q-avatar size="5rem" font-size="52px" color="teal" text-color="white" icon="person" />
        </div>

        <div class="q-gutter-y-lg">
          <q-input
            dense
            input-class="text-center"
            bottom-slots
            v-model="accountName"
            debounce="1000"
            @update:model-value="onNameChange"
            :loading="nameLoading"
          >
            <template v-slot:append>
              <q-icon name="edit" size="xs" />
            </template>
            <template v-slot:hint>
              <div class="text-center text-[0.9rem]">Account Name</div>
            </template>
          </q-input>

          <q-input outlined readonly v-model="emailAddress" label="Email Address" />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-[1rem] font-[500]">Change Password</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="changePassword">
          <div class="q-gutter-y-sm">
            <q-input
              outlined
              :type="showPassword ? 'text' : 'password'"
              v-model="changePasswordForm.old_password"
              label="Current Password"
              :error="!!errors.old_password"
              :error-message="errors.old_password"
            />
            <q-input
              outlined
              :type="showPassword ? 'text' : 'password'"
              v-model="changePasswordForm.password"
              label="New Password"
              :error="!!errors.password"
              :error-message="errors.password"
            />
            <q-input
              outlined
              :type="showPassword ? 'text' : 'password'"
              v-model="changePasswordForm.password_confirmation"
              label="Confirm Password"
            />

            <div class="flex items-center justify-between q-mt-md">
              <q-btn
                type="submit"
                label="Update"
                color="secondary"
                :loading="passwordLoading"
                :disable="passwordLoading"
              />

              <q-toggle
                v-model="showPassword"
                color="grey-8"
                :icon="showPassword ? 'visibility_off' : 'visibility'"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { AxiosError } from 'axios';
import { getErrMessage } from 'src/assets/utils';
import type { ChangePassword } from 'src/composables/interfaces/IApp';
import { useAlertStore } from 'src/stores/alert-store';
import { useUserStore } from 'src/stores/user-store';
import { reactive, ref } from 'vue';

const alertStore = useAlertStore();
const userStore = useUserStore();

const nameLoading = ref<boolean>(false);
const accountName = ref<string>(userStore.getData?.name || '');
const emailAddress = ref<string>(userStore.getData?.email || '');
const passwordLoading = ref<boolean>(false);
const showPassword = ref<boolean>(false);

const errors = reactive({
  old_password: '' as string,
  password: '' as string,
});

const changePasswordForm = reactive<ChangePassword>({
  old_password: '',
  password: '',
  password_confirmation: '',
});

const onNameChange = async (): Promise<void> => {
  if (userStore.getData?.name === accountName.value) return;

  nameLoading.value = true;
  try {
    await userStore.changeName(accountName.value);
  } catch {
    accountName.value = userStore.getData?.name || '';
  } finally {
    nameLoading.value = false;
  }
};

const changePassword = async (): Promise<void> => {
  errors.old_password = '';
  errors.password = '';

  passwordLoading.value = true;

  try {
    await userStore.changePassword(changePasswordForm);
  } catch (err) {
    let message = 'Unable to complete the requested action.';

    if (err instanceof AxiosError) {
      message = getErrMessage(err);

      const resErrors = err.response?.data?.errors as {
        old_password?: string[];
        password?: string[];
      };

      if (err.response?.status === 422 && resErrors) {
        errors.old_password = resErrors.old_password?.[0] ?? '';
        errors.password = resErrors.password?.[0] ?? '';
      }
    }

    alertStore.Swap({ type: 'negative', message });
  } finally {
    passwordLoading.value = false;
  }
};
</script>
