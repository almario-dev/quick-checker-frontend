<template>
  <q-page class="q-pa-md">
    <div>
      <h4 class="text-bold mb-6 mt-8 flex items-center gap-2">
        <div class="wave-emoji">👋</div>
        Hi {{ userStore.getData?.name }}!
      </h4>
    </div>

    <div class="q-mt-sm q-gutter-sm">
      <q-card class="shadow-6">
        <q-card-section>
          <div class="text-[1.3rem] text-blue-grey-9 mb-5 mt-2">Ready to check some tests?</div>

          <p class="text-blue-grey-8">
            <strong>💡 AI Tip:</strong>
            <i> Lighting matters! Avoid shadows when scanning. </i>
          </p>
          <q-btn label="Scan Now" color="secondary" icon="document_scanner" padding="0.7rem" />
        </q-card-section>
      </q-card>

      <q-card class="bg-transparent no-shadow">
        <q-card-section class="q-px-none">
          <div class="text-[1rem] font-[500] text-blue-grey-10">Latest check(s)</div>
        </q-card-section>

        <q-card-section class="q-px-none q-py-none">
          <q-list class="q-gutter-y-md">
            <q-item
              v-for="i in 3"
              :key="i"
              class="bg-white shadow-3 rounded-borders"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-avatar rounded size="4rem">
                  <Image size="lg" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1" class="font-[600]">Grade 5 Science </q-item-label>
                <q-item-label lines="2" caption> 1 student got a perfect score! 🎉 </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label>1 min ago</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="flex justify-center">
            <q-btn label="View More" flat class="q-mt-md" text-color="blue-grey-5" />
          </div>
        </q-card-section>
      </q-card>

      <MySubjects />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Image, MySubjects } from 'src/components';
import { useUserStore } from 'src/stores/user-store';

const userStore = useUserStore();
</script>
