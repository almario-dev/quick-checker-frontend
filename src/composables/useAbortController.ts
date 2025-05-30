import { ref } from 'vue';

type ControllerMap = Map<string, AbortController>;

const controllers = ref<ControllerMap>(new Map());

export function useAbortController() {
  // Create and store a new controller with a key
  function create(key: string): AbortController {
    // Abort previous controller with the same key if exists
    if (controllers.value.has(key)) {
      controllers.value.get(key)?.abort();
    }
    const controller = new AbortController();
    controllers.value.set(key, controller);
    return controller;
  }

  // Abort and remove a controller by key
  function abort(key: string) {
    if (controllers.value.has(key)) {
      controllers.value.get(key)?.abort();
      controllers.value.delete(key);
    }
  }

  function remove(key: string) {
    if (controllers.value.has(key)) {
      controllers.value.delete(key);
    }
  }

  // Abort all controllers
  function abortAll() {
    controllers.value.forEach((controller) => controller.abort());
    controllers.value.clear();
  }

  // Get a controller by key
  function get(key: string): AbortController | undefined {
    return controllers.value.get(key);
  }

  // Check existence
  function exists(key: string): boolean {
    return controllers.value.get(key) != undefined;
  }

  // exit if exists
  function exitWhenExist(key: string): void {
    if (controllers.value.get(key) != undefined) {
      throw new Error('Exit when exist: ' + key);
    }
  }

  function createButExitWhenExist(key: string): AbortController {
    if (controllers.value.get(key) != undefined) {
      throw new Error(
        `Unable to start a new '${key}' request because a previous request is still in progress.`,
      );
    }

    return create(key);
  }

  return {
    create,
    abort,
    abortAll,
    remove,
    get,
    exists,
    exitWhenExist,
    createButExitWhenExist,
  };
}
