import { defineStore } from 'pinia';
import type { UserData } from 'src/composables/types/auth';
import { computed, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const data = ref<UserData>(null);

  const getData = computed((): UserData => data.value);

  const isAuthenticated = computed((): boolean => data.value !== null);

  const setData = (newData: UserData) => {
    data.value = newData;
  };

  return { data, getData, isAuthenticated, setData };
});
