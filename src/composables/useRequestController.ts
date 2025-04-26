type RequestFn<T> = (signal: AbortSignal) => Promise<T>;

type SendMode = 'normal' | 'debounce' | 'latest'; // the 3 modes

interface SendOptions {
  mode?: SendMode; // defaults to 'normal'
}

export function useRequestController() {
  const controllers = new Map<string, AbortController>();

  const send = async <T>(
    key: string,
    requestFn: RequestFn<T>,
    options: SendOptions = { mode: 'normal' },
  ): Promise<T | undefined> => {
    const isRunning = controllers.has(key);
    const mode = options.mode || 'normal';

    // --- Handle modes ---
    if (mode === 'debounce' && isRunning) {
      // Don't send new if old is active
      return undefined;
    }

    if (mode === 'latest' && isRunning) {
      // Cancel old before sending new
      controllers.get(key)!.abort();
    }

    // 'normal' allows multiple requests, no cancellation

    const controller = new AbortController();
    controllers.set(key, controller);

    try {
      const result = await requestFn(controller.signal);
      return result;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        console.warn(`Request "${key}" was aborted.`);
      }
      throw err;
    } finally {
      controllers.delete(key);
    }
  };

  const runOnce = async <T>(key: string, requestFn: RequestFn<T>): Promise<T | undefined> => {
    if (controllers.has(key)) return undefined;

    const controller = new AbortController();
    controllers.set(key, controller);

    try {
      const result = await requestFn(controller.signal);
      return result;
    } finally {
      // controllers.delete(key);
    }
  };

  const cancel = (key: string): void => {
    const controller = controllers.get(key);
    if (controller) {
      controller.abort();
      controllers.delete(key);
    }
  };

  const cancelAll = (): void => {
    controllers.forEach((controller) => controller.abort());
    controllers.clear();
  };

  const isActive = (key: string): boolean => controllers.has(key);

  const reset = (key: string): void => {
    if (controllers.get(key)) {
      controllers.delete(key);
    }
  };

  const resetAll = (): void => {
    controllers.clear();
  };

  return {
    send,
    runOnce,
    cancel,
    cancelAll,
    isActive,
    reset,
    resetAll,
  };
}
