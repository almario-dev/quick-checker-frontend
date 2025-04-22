import { defineBoot } from '#q-app/wrappers';
import { api } from './axios';

export default defineBoot(async () => {
  try {
    // Step 1: Initialize CSRF cookie (important!)
    await api.get('../sanctum/csrf-cookie');
  } catch (err) {
    console.error(err);
  }
});
