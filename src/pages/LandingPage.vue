<template>
  <q-page
    class="bg-gradient-to-br from-[#2c3e50] to-[#f5f5f5] text-[#2c3e50] flex items-center justify-center"
  >
    <div class="container px-4 py-10">
      <div class="flex flex-col lg:flex-row items-center">
        <!-- Left Section -->
        <div class="w-full lg:w-3/5 mb-10 lg:mb-0 max-lg:text-center lg:text-left">
          <div
            class="text-[#000000]/80 dark:text-white font-light max-lg:text-5xl lg:text-8xl max-lg:leading-snug lg:leading-none mb-4 max-lg:mt-10"
          >
            AI-Powered<br />
            <span class="text-dark dark:text-white font-semibold">Quick Checker</span>
          </div>
          <p
            class="max-lg:text-lg max-lg:py-10 lg:text-2xl lg:w-4/5 lg:py-4 text-white/90 font-medium mb-6"
          >
            Instantly scan and check test papers with AI precision. Fast, accurate, and built for
            educators.
          </p>
          <div
            class="flex flex-col max-lg:items-center lg:items-stretch sm:flex-row lg:justify-start gap-3"
          >
            <!-- Download Button -->
            <a
              href="releases/quick-checker.apk"
              class="flex items-center justify-center px-6 py-3 transition-all bg-[#2c3e50] hover:bg-[#2c3e50]/90 rounded-xl hover:shadow-primary-hover"
            >
              <span class="pr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                  />
                </svg>
              </span>
              <span class="text-white font-bold text-sm sm:text-base">
                <span class="block text-xs text-white/80">Get it now</span>
                Download App
              </span>
            </a>
            <!-- Subtle Login Link -->
            <router-link
              v-if="!$q.platform.is.nativeMobileWrapper"
              :to="{ name: 'Admin Login' }"
              href="#"
              class="text-sm font-semibold text-white border border-white hover:bg-white/10 hover:text-[#2c3e50] transition-colors px-6 py-2 rounded-lg mt-2 sm:mt-0 sm:ml-4 flex items-center"
            >
              Login as Admin
            </router-link>
          </div>
        </div>

        <!-- Right Section (Image) -->
        <div class="w-full lg:w-2/5 text-center relative z-10">
          <img
            src="src/assets/ui1.png"
            alt="hero-image"
            class="w-64 mx-auto rounded-3xl bg-white p-2"
          />
          <!-- Background circles -->
          <span
            class="absolute -z-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] bg-white/25 dark:bg-dark/25 shadow-shape-1 rounded-full"
          ></span>
          <span
            class="absolute -z-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] sm:w-[450px] sm:h-[450px] bg-white/25 dark:bg-dark/25 shadow-shape-1 rounded-full"
          ></span>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();
</script>
