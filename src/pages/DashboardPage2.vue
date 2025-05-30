<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <q-toolbar class="px-4">
        <q-avatar class="mr-3">
          <q-icon name="psychology" class="text-2xl" />
        </q-avatar>

        <q-toolbar-title class="text-lg font-semibold"> Quick Checker </q-toolbar-title>

        <q-btn flat round icon="notifications" class="mr-2">
          <q-badge color="red" floating>3</q-badge>
        </q-btn>

        <q-btn flat round icon="account_circle" @click="showProfile = true" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="bg-gray-50 min-h-screen">
        <!-- Welcome Section -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold mb-1">Welcome back, {{ teacherName }}!</h1>
              <p class="text-blue-100 text-sm">{{ currentDate }}</p>
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
                <div
                  class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3"
                >
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
                <div
                  class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-3"
                >
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
              @click="showWorkflowDialog = true"
              color="primary"
              size="lg"
              class="full-width"
              style="height: 60px; border-radius: 16px; font-weight: 500"
              no-caps
            >
              <q-icon name="document_scanner" size="24px" class="q-mr-sm" />
              Start Checking Process
            </q-btn>
          </div>

          <!-- Workflow Steps -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div class="grid grid-cols-1 gap-3">
              <q-btn
                @click="manageSubjects"
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
                @click="manageAnswerKeys"
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
                @click="checkAnswerSheets"
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

          <!-- Recent Activity -->
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-800">Recent Activity</h3>
              <q-btn flat size="sm" color="primary" label="View All" no-caps />
            </div>

            <q-tabs v-model="activeTab" dense align="left" class="text-grey-6 q-mb-md">
              <q-tab name="subjects" label="Subjects" />
              <q-tab name="answer-keys" label="Answer Keys" />
              <q-tab name="answer-sheets" label="Answer Sheets" />
            </q-tabs>

            <q-tab-panels v-model="activeTab" animated>
              <!-- Subjects Tab -->
              <q-tab-panel name="subjects" class="q-pa-none">
                <div class="space-y-3" v-if="subjects.length > 0">
                  <div
                    v-for="subject in subjects"
                    :key="subject.id"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div class="flex items-center">
                      <div
                        class="w-8 h-8 rounded-lg flex items-center justify-center q-mr-sm"
                        :style="`background-color: ${subject.color}20`"
                      >
                        <q-icon
                          :name="subject.icon"
                          :style="`color: ${subject.color}`"
                          size="16px"
                        />
                      </div>
                      <div>
                        <div class="font-medium text-gray-800 text-sm">{{ subject.name }}</div>
                        <div class="text-xs text-gray-500">{{ subject.description }}</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-semibold text-gray-800">
                        {{ subject.answerKeysCount }}
                      </div>
                      <div class="text-xs text-gray-500">Answer Keys</div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <q-icon name="category" size="48px" color="grey-4" />
                  <p class="text-gray-500 q-mt-sm">No subjects created yet</p>
                  <q-btn @click="manageSubjects" color="primary" size="sm" class="q-mt-sm" no-caps>
                    Create First Subject
                  </q-btn>
                </div>
              </q-tab-panel>

              <!-- Answer Keys Tab -->
              <q-tab-panel name="answer-keys" class="q-pa-none">
                <div class="space-y-3" v-if="answerKeys.length > 0">
                  <div
                    v-for="answerKey in answerKeys"
                    :key="answerKey.id"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div class="flex items-center">
                      <div
                        class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center q-mr-sm"
                      >
                        <q-icon name="key" color="green-6" size="16px" />
                      </div>
                      <div>
                        <div class="font-medium text-gray-800 text-sm">{{ answerKey.name }}</div>
                        <div class="text-xs text-gray-500">
                          {{ answerKey.subject }} • {{ answerKey.date }}
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-semibold text-gray-800">
                        {{ answerKey.questionsCount }}
                      </div>
                      <div class="text-xs text-gray-500">Questions</div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <q-icon name="key" size="48px" color="grey-4" />
                  <p class="text-gray-500 q-mt-sm">No answer keys created yet</p>
                  <q-btn @click="manageAnswerKeys" color="green" size="sm" class="q-mt-sm" no-caps>
                    Create First Answer Key
                  </q-btn>
                </div>
              </q-tab-panel>

              <!-- Answer Sheets Tab -->
              <q-tab-panel name="answer-sheets" class="q-pa-none">
                <div class="space-y-3" v-if="answerSheets.length > 0">
                  <div
                    v-for="sheet in answerSheets"
                    :key="sheet.id"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div class="flex items-center">
                      <div
                        class="w-8 h-8 rounded-lg flex items-center justify-center q-mr-sm"
                        :style="`background-color: ${getStatusColor(sheet.status)}20`"
                      >
                        <q-icon
                          :name="getStatusIcon(sheet.status)"
                          :style="`color: ${getStatusColor(sheet.status)}`"
                          size="16px"
                        />
                      </div>
                      <div>
                        <div class="font-medium text-gray-800 text-sm">{{ sheet.studentName }}</div>
                        <div class="text-xs text-gray-500">
                          {{ sheet.subject }} • {{ sheet.date }}
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-semibold text-gray-800" v-if="sheet.score !== null">
                        {{ sheet.score }}%
                      </div>
                      <div class="text-xs" :style="`color: ${getStatusColor(sheet.status)}`">
                        {{ sheet.status }}
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <q-icon name="fact_check" size="48px" color="grey-4" />
                  <p class="text-gray-500 q-mt-sm">No answer sheets checked yet</p>
                  <q-btn
                    @click="checkAnswerSheets"
                    color="orange"
                    size="sm"
                    class="q-mt-sm"
                    no-caps
                  >
                    Check First Answer Sheet
                  </q-btn>
                </div>
              </q-tab-panel>
            </q-tab-panels>
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
                <strong>Common Mistakes:</strong> Questions 5 and 12 have the highest error rates in
                your recent Math tests.
              </div>
              <div class="text-sm text-gray-700">
                <strong>Performance Trend:</strong> Class average improved by 8% compared to last
                month.
              </div>
            </div>

            <q-btn
              flat
              size="sm"
              color="purple"
              label="View Detailed Analysis"
              class="mt-3"
              no-caps
            />
          </div>

          <!-- Performance Chart -->
          <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Weekly Performance</h3>
            <div
              class="h-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center"
            >
              <q-icon name="bar_chart" class="text-4xl text-gray-400" />
              <span class="ml-2 text-gray-500">Chart will be implemented here</span>
            </div>
          </div>
        </div>

        <!-- Profile Dialog -->
        <q-dialog v-model="showProfile" position="bottom">
          <q-card class="w-full rounded-t-3xl">
            <q-card-section class="text-center pb-0">
              <q-avatar size="80px" class="mb-4">
                <img src="https://via.placeholder.com/80x80?text=T" alt="Teacher Avatar" />
              </q-avatar>
              <h3 class="text-xl font-semibold text-gray-800">{{ teacherName }}</h3>
              <p class="text-gray-600 text-sm">{{ teacherEmail }}</p>
              <p class="text-gray-500 text-xs">{{ teacherSchool }}</p>
            </q-card-section>

            <q-card-section class="pt-6">
              <div class="space-y-2">
                <q-btn
                  flat
                  class="w-full justify-start text-gray-700 py-3"
                  icon="person"
                  label="Edit Profile"
                  no-caps
                />
                <q-btn
                  flat
                  class="w-full justify-start text-gray-700 py-3"
                  icon="settings"
                  label="Settings"
                  no-caps
                />
                <q-btn
                  flat
                  class="w-full justify-start text-gray-700 py-3"
                  icon="help"
                  label="Help & Support"
                  no-caps
                />
                <q-separator class="my-2" />
                <q-btn
                  flat
                  class="w-full justify-start text-red-600 py-3"
                  icon="logout"
                  label="Sign Out"
                  no-caps
                  @click="logout"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Workflow Dialog -->
        <q-dialog v-model="showWorkflowDialog" persistent>
          <q-card style="min-width: 350px; border-radius: 16px">
            <q-card-section class="text-center">
              <div
                style="
                  width: 64px;
                  height: 64px;
                  background-color: #e3f2fd;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 0 auto 16px;
                "
              >
                <q-icon name="psychology" color="primary" size="32px" />
              </div>
              <h3 class="text-lg font-semibold text-gray-800 q-mb-sm">Quick Checker Workflow</h3>
              <p class="text-gray-600 text-sm q-mb-lg">
                Choose your next step in the checking process
              </p>

              <div class="q-gutter-md">
                <q-btn
                  @click="manageSubjects"
                  color="purple"
                  style="width: 100%; height: 48px; border-radius: 12px"
                  no-caps
                >
                  <q-icon name="category" class="q-mr-sm" />
                  1. Manage Subjects
                </q-btn>

                <q-btn
                  @click="manageAnswerKeys"
                  color="green"
                  style="width: 100%; height: 48px; border-radius: 12px"
                  no-caps
                >
                  <q-icon name="key" class="q-mr-sm" />
                  2. Create Answer Keys
                </q-btn>

                <q-btn
                  @click="checkAnswerSheets"
                  color="orange"
                  style="width: 100%; height: 48px; border-radius: 12px"
                  no-caps
                >
                  <q-icon name="fact_check" class="q-mr-sm" />
                  3. Check Answer Sheets
                </q-btn>
              </div>

              <q-btn
                flat
                label="Cancel"
                color="grey-6"
                class="q-mt-md"
                no-caps
                @click="closeWorkflowDialog"
              />
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Interfaces
interface Subject {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  answerKeysCount: number;
}

interface AnswerKey {
  id: number;
  name: string;
  subject: string;
  date: string;
  questionsCount: number;
}

interface AnswerSheet {
  id: number;
  studentName: string;
  subject: string;
  date: string;
  status: 'Pending' | 'Checked' | 'Review';
  score: number | null;
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
const showWorkflowDialog = ref<boolean>(false);
const activeTab = ref<string>('subjects');

// Sample data
const subjects = ref<Subject[]>([
  {
    id: 1,
    name: 'Mathematics',
    description: 'Algebra, Geometry, Calculus',
    icon: 'calculate',
    color: '#1976D2',
    answerKeysCount: 5,
  },
  {
    id: 2,
    name: 'Science',
    description: 'Physics, Chemistry, Biology',
    icon: 'science',
    color: '#388E3C',
    answerKeysCount: 3,
  },
  {
    id: 3,
    name: 'English',
    description: 'Literature, Grammar, Writing',
    icon: 'menu_book',
    color: '#F57C00',
    answerKeysCount: 2,
  },
]);

const answerKeys = ref<AnswerKey[]>([
  {
    id: 1,
    name: 'Algebra Quiz #3',
    subject: 'Mathematics',
    date: 'May 28',
    questionsCount: 25,
  },
  {
    id: 2,
    name: 'Biology Midterm',
    subject: 'Science',
    date: 'May 27',
    questionsCount: 40,
  },
  {
    id: 3,
    name: 'Grammar Test',
    subject: 'English',
    date: 'May 26',
    questionsCount: 30,
  },
]);

const answerSheets = ref<AnswerSheet[]>([
  {
    id: 1,
    studentName: 'John Smith',
    subject: 'Mathematics',
    date: 'May 29',
    status: 'Checked',
    score: 85,
  },
  {
    id: 2,
    studentName: 'Sarah Johnson',
    subject: 'Science',
    date: 'May 29',
    status: 'Pending',
    score: null,
  },
  {
    id: 3,
    studentName: 'Mike Davis',
    subject: 'Mathematics',
    date: 'May 28',
    status: 'Review',
    score: 78,
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
const getStatusIcon = (status: string): string => {
  const iconMap: Record<string, string> = {
    Pending: 'schedule',
    Checked: 'check_circle',
    Review: 'rate_review',
  };
  return iconMap[status] || 'help';
};

const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    Pending: '#FF9800',
    Checked: '#4CAF50',
    Review: '#2196F3',
  };
  return colorMap[status] || '#9E9E9E';
};

// const showWorkflowDialog = (): void => {
//   showWorkflowDialog.value = true;
// };

const closeWorkflowDialog = (): void => {
  showWorkflowDialog.value = false;
};

const manageSubjects = (): void => {
  console.log('Navigate to Manage Subjects');
  showWorkflowDialog.value = false;
  // Add navigation logic here
};

const manageAnswerKeys = (): void => {
  console.log('Navigate to Manage Answer Keys');
  showWorkflowDialog.value = false;
  // Add navigation logic here
};

const checkAnswerSheets = (): void => {
  console.log('Navigate to Check Answer Sheets');
  showWorkflowDialog.value = false;
  // Add navigation logic here
};

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

<style scoped>
/* Custom animations */
@keyframes pulse-gentle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.pulse-gentle {
  animation: pulse-gentle 2s ease-in-out infinite;
}

/* Smooth transitions */
.q-btn,
.q-card {
  transition: all 0.2s ease-in-out;
}

/* Hover effects */
.q-btn:hover {
  transform: translateY(-1px);
}

/* Custom gradients */
.bg-gradient-to-r {
  background: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-br {
  background: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
</style>
