import { defineStore } from '#q-app/wrappers';
import { createPinia } from 'pinia';
import { createPersistedState, type PluginOptions } from 'pinia-plugin-persistedstate';
import pkg from '../../package.json';

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PiniaCustomProperties {
    // add your custom properties here, if any
  }
}

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default defineStore((/* { ssrContext } */) => {
  const pinia = createPinia();

  const options: PluginOptions = {
    key: (id: string) => pkg.name + '_' + id,
  };

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)
  pinia.use(createPersistedState(options));

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  return pinia;
});
