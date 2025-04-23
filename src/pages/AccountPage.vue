<template>
  <q-page class="q-pa-md q-gutter-lg">
    <q-card class="bg-transparent no-shadow">
      <q-card-section>
        <q-form>
          <div class="flex justify-center mb-12">
            <q-avatar size="5rem" font-size="52px" color="teal" text-color="white" icon="person" />
          </div>

          <div class="q-gutter-y-lg">
            <q-input dense input-class="text-center" bottom-slots v-model="accountName">
              <template v-slot:append>
                <q-icon name="edit" size="xs" />
              </template>
              <template v-slot:hint>
                <div class="text-center text-[0.9rem]">Account Name</div>
              </template>
            </q-input>

            <q-input outlined readonly v-model="emailAddress" label="Email Address" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-[1rem] font-[500]">Change Password</div>
      </q-card-section>

      <q-card-section>
        <q-form>
          <div class="q-gutter-y-md">
            <q-input outlined v-model="changePasswordForm.old_password" label="Current Password" />
            <q-input outlined v-model="changePasswordForm.password" label="New Password" />
            <q-input
              outlined
              v-model="changePasswordForm.password_confirmation"
              label="Confirm Password"
            />

            <q-btn label="Submit" color="secondary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useUserStore } from 'src/stores/user-store';
import { reactive, ref } from 'vue';

interface ChangePassword {
  old_password: string;
  password: string;
  password_confirmation: string;
}

const userStore = useUserStore();

const accountName = ref<string>(userStore.getData?.name || '');
const emailAddress = ref<string>(userStore.getData?.email || '');

const changePasswordForm = reactive<ChangePassword>({
  old_password: '',
  password: '',
  password_confirmation: '',
});
</script>
