<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <!-- Header Section -->
        <div class="flex-shrink-0 text-center pt-12 pb-8 px-6">
          <!-- Logo/Icon -->
          <div
            class="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
            style="background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)"
          >
            <q-img :src="Logo" />
          </div>

          <!-- App Title -->
          <div class="text-3xl font-bold text-gray-800 mb-2">Quick Checker</div>
          <p class="text-gray-600 text-sm leading-relaxed px-4">
            AI-powered answer sheet checking for modern educators
          </p>
        </div>

        <!-- Main Content -->
        <main class="flex-1 px-6 pb-8">
          <router-view />

          <!-- Footer -->
          <div class="text-center mt-8 px-4">
            <p class="text-xs text-gray-500 leading-relaxed">
              Secure authentication powered by AI technology<br />
              Designed for educators, by educators
            </p>
          </div>
        </main>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { Logo } from 'src/assets/images.exports';
</script>
