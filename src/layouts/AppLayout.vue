<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->

    <q-header reveal class="text-white shadow-lg">
      <div class="bg-gradient-purplish">
        <q-toolbar class="px-4 flex items-center justify-between">
          <q-avatar class="mr-3">
            <q-img :src="Logo" />
          </q-avatar>
          <q-btn flat round icon="account_circle" @click="showProfile = true" />
        </q-toolbar>
      </div>
    </q-header>

    <q-page-container>
      <q-page class="bg-gray-50 min-h-screen">
        <router-view />

        <!-- Profile Dialog -->
        <q-dialog v-model="showProfile" position="bottom">
          <q-card class="w-full rounded-t-3xl">
            <q-card-section class="text-center pb-0">
              <q-avatar size="80px" class="mb-4" icon="person" color="grey-4" text-color="grey-6" />
              <div class="text-xl font-semibold text-gray-800">{{ teacherName }}</div>
              <p class="text-gray-600 text-sm">{{ teacherEmail }}</p>
              <p class="text-gray-500 text-xs">{{ teacherSchool }}</p>
            </q-card-section>

            <q-card-section class="pt-6">
              <div class="space-y-2 flex flex-col">
                <q-btn
                  flat
                  class="full-width"
                  icon="person"
                  padding=".5rem"
                  align="left"
                  color="grey-9"
                  label="Edit Profile"
                  no-caps
                />
                <q-btn
                  flat
                  class="full-width"
                  icon="settings"
                  padding=".5rem"
                  align="left"
                  color="grey-9"
                  label="Settings"
                  no-caps
                />
                <q-btn
                  flat
                  class="full-width"
                  icon="help"
                  padding=".5rem"
                  align="left"
                  color="grey-9"
                  label="Help & Support"
                  no-caps
                />
                <q-separator class="my-2" />
                <q-btn
                  flat
                  class="full-width"
                  icon="logout"
                  align="left"
                  padding=".5rem"
                  color="red-5"
                  label="Sign Out"
                  no-caps
                  @click="logout"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Scanning Dialog -->
        <q-dialog v-model="showScanDialog" persistent>
          <q-card class="w-full max-w-sm rounded-2xl">
            <q-card-section class="text-center">
              <div
                class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <q-icon name="document_scanner" class="text-blue-600 text-2xl" />
              </div>
              <div class="text-lg font-semibold text-gray-800 mb-2">Ready to Scan</div>
              <p class="text-gray-600 text-sm mb-4">
                Position your answer sheets clearly and tap to start scanning
              </p>

              <q-btn
                @click="simulateScanning"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium mb-3"
                no-caps
                :loading="scanInProgress"
                :disable="scanInProgress"
              >
                {{ scanInProgress ? 'Scanning...' : 'Start Scanning' }}
              </q-btn>

              <q-btn
                flat
                label="Cancel"
                class="w-full text-gray-600"
                no-caps
                @click="closeScanDialog"
                :disable="scanInProgress"
              />
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>

    <q-footer class="bg-white text-blue-50 border-t border-gray-200">
      <div class="grid grid-cols-5 py-2">
        <q-btn square flat color="primary" icon="home" />
        <q-btn square flat color="primary" icon="document_scanner" />
        <q-btn square flat color="primary" icon="bar_chart" />
        <q-btn square flat color="primary" icon="assignment" />
        <q-btn square flat color="primary" icon="settings" />
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
/*eslint-disable*/
import { ref, computed, onMounted } from 'vue';
import { Logo } from 'src/assets/images.exports';

// Interfaces
interface RecentTest {
  id: number;
  name: string;
  subject: string;
  date: string;
  scanned: number;
  total: number;
}

// Reactive data
const teacherName = ref<string>('Ms. Johnson');
const teacherEmail = ref<string>('johnson@school.edu');
const teacherSchool = ref<string>('Riverside High School');
const totalScanned = ref<number>(847);
const completedTests = ref<number>(12);
const pendingReviews = ref<number>(3);

// UI state
const showProfile = ref<boolean>(false);
const showScanDialog = ref<boolean>(false);
const scanningLoading = ref<boolean>(false);
const scanInProgress = ref<boolean>(false);

// Sample data
const recentTests = ref<RecentTest[]>([
  {
    id: 1,
    name: 'Algebra Quiz #3',
    subject: 'Mathematics',
    date: 'May 28',
    scanned: 24,
    total: 28,
  },
  {
    id: 2,
    name: 'Biology Midterm',
    subject: 'Science',
    date: 'May 27',
    scanned: 31,
    total: 31,
  },
  {
    id: 3,
    name: 'History Essay Test',
    subject: 'History',
    date: 'May 26',
    scanned: 18,
    total: 25,
  },
]);

const simulateScanning = (): void => {
  scanInProgress.value = true;
  // Simulate scanning process
  setTimeout(() => {
    scanInProgress.value = false;
    showScanDialog.value = false;
    // Show success message or navigate to results
    console.log('Scanning completed successfully!');
  }, 3000);
};

const closeScanDialog = (): void => {
  if (!scanInProgress.value) {
    showScanDialog.value = false;
  }
};

// const viewResults = (): void => {
//   console.log('Navigate to results page');
// };

// const createTest = (): void => {
//   console.log('Navigate to create test page');
// };

const logout = (): void => {
  console.log('User logged out');
  showProfile.value = false;
};

// Lifecycle
onMounted(() => {
  // Initialize dashboard data
  console.log('Dashboard mounted');
});
</script>

<style lang="scss"></style>
