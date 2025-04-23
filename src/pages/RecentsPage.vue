<template>
  <q-page class="q-pa-md">
    <q-card class="bg-transparent no-shadow">
      <q-card-section class="flex gap-[1rem] items-start q-px-none">
        <q-input class="grow" bottom-slots dense v-model="search" label="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn icon="sort" flat dense />
      </q-card-section>

      <q-card-section class="q-px-none q-py-none">
        <q-list class="q-gutter-y-md">
          <q-item
            v-for="i in 15"
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
          <q-btn label="Show more" flat class="q-mt-sm" text-color="blue-grey-5" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { Image } from 'src/components';
import { ref } from 'vue';

const search = ref<string>('');
</script>
