<template>
  <!-- Welcome Section -->
  <div class="text-white px-4 py-6 bg-gradient-purplish">
    <div class="grid gap-3 grid-cols-3 place-items-center">
      <div class="col-span-2 w-full flex flex-col text-2xl font-bold">
        <div>Welcome back,</div>
        <div class="mb-1">{{ teacherName }}</div>
        <p class="text-blue-100 font-normal text-sm">{{ currentDate }}</p>
      </div>
      <div class="text-right">
        <div class="text-2xl font-bold">{{ totalScanned }}</div>
        <div class="text-xs text-blue-100">Papers Scanned</div>
      </div>
    </div>
  </div>

  <!-- Quick Stats -->
  <div class="px-4 py-6">
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
            <q-icon name="check_circle" class="text-green-600 text-xl" />
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-800">{{ completedTests }}</div>
            <div class="text-xs text-gray-500">Completed</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-3">
            <q-icon name="pending" class="text-orange-600 text-xl" />
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-800">{{ pendingReviews }}</div>
            <div class="text-xs text-gray-500">Pending</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Action Button -->
    <div class="mb-6">
      <q-btn
        @click="startScanning"
        class="full-width rounded-2xl font-medium shadow-lg"
        color="primary"
        padding="0.9rem"
        no-caps
        :loading="scanningLoading"
      >
        <q-icon name="document_scanner" class="mr-2 text-xl" />
        Scan Answer Sheets
      </q-btn>
    </div>

    <!-- Quick Actions -->
    <div class="mb-6">
      <div class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</div>
      <div class="grid grid-cols-1 gap-3">
        <q-btn
          outline
          color="purple"
          class="full-width"
          style="height: 50px; border-radius: 12px"
          no-caps
        >
          <q-icon name="category" class="q-mr-sm" />
          Manage Subjects
        </q-btn>

        <q-btn
          outline
          color="green"
          class="full-width"
          style="height: 50px; border-radius: 12px"
          no-caps
        >
          <q-icon name="key" class="q-mr-sm" />
          Answer Keys
        </q-btn>

        <q-btn
          outline
          color="orange"
          class="full-width"
          style="height: 50px; border-radius: 12px"
          no-caps
        >
          <q-icon name="fact_check" class="q-mr-sm" />
          Check Answer Sheets
        </q-btn>
      </div>
    </div>

    <!-- Recent Tests -->
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div class="text-lg font-semibold text-gray-800">Recent Tests</div>
        <q-btn flat size="sm" color="blue" label="View All" no-caps />
      </div>

      <div class="space-y-3">
        <div
          v-for="test in recentTests"
          :key="test.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
        >
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <q-icon :name="getTestIcon(test.subject)" class="text-blue-600 text-sm" />
            </div>
            <div>
              <div class="font-medium text-gray-800 text-sm">{{ test.name }}</div>
              <div class="text-xs text-gray-500">{{ test.subject }} • {{ test.date }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-semibold text-gray-800">
              {{ test.scanned }}/{{ test.total }}
            </div>
            <div class="text-xs text-gray-500">Scanned</div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Insights -->
    <div
      class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100 mb-6"
    >
      <div class="flex items-center mb-3">
        <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
          <q-icon name="psychology" class="text-purple-600 text-lg" />
        </div>
        <h3 class="text-lg font-semibold text-gray-800">AI Insights</h3>
      </div>

      <div class="space-y-2">
        <div class="text-sm text-gray-700">
          <strong>Common Mistakes:</strong> Questions 5 and 12 have the highest error rates in your
          recent Math tests.
        </div>
        <div class="text-sm text-gray-700">
          <strong>Performance Trend:</strong> Class average improved by 8% compared to last month.
        </div>
      </div>

      <q-btn flat size="sm" color="purple" label="View Detailed Analysis" class="mt-3" no-caps />
    </div>

    <!-- Performance Chart -->
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div class="text-lg font-semibold text-gray-800 mb-4">Weekly Performance</div>
      <div
        class="h-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center"
      >
        <q-icon name="bar_chart" class="text-4xl text-gray-400" />
        <span class="ml-2 text-gray-500">Chart will be implemented here</span>
      </div>
    </div>
  </div>

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
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium mb-3"
          no-caps
        >
          {{ 0 ? 'Scanning...' : 'Start Scanning' }}
        </q-btn>

        <q-btn flat label="Cancel" class="w-full text-gray-600" no-caps />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { dialog } from 'src/composables/usePopup';
import { ref, computed, onMounted } from 'vue';

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
const totalScanned = ref<number>(847);
const completedTests = ref<number>(12);
const pendingReviews = ref<number>(3);

// UI state
const showScanDialog = ref<boolean>(false);
const scanningLoading = ref<boolean>(false);

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

// Computed
const currentDate = computed<string>(() => {
  const today = new Date();
  return today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Methods
const getTestIcon = (subject: string): string => {
  const iconMap: Record<string, string> = {
    Mathematics: 'calculate',
    Science: 'science',
    History: 'history_edu',
    English: 'menu_book',
    Geography: 'public',
    Physics: 'atom',
    Chemistry: 'science',
    Biology: 'biotech',
  };
  return iconMap[subject] || 'subject';
};

const startScanning = (): void => {
  // showScanDialog.value = true;
  dialog({
    title: 'Invalid session',
    message: 'hi',
    icon: 'error',
    iconBg: 'bg-red-2',
    iconClass: 'text-red-5',
  })
    .then((action) => {
      console.log(action);
    })
    .catch(() => {
      //
    });
};

// Lifecycle
onMounted(() => {
  // Initialize dashboard data
  console.log('Dashboard mounted');
});
</script>
