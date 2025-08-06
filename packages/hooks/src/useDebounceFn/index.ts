import { debounce, Fn } from '../utils';
import { onScopeDispose, ref, Ref, watch } from 'vue';

export interface DebounceOptions {
  /**
   * The number of milliseconds to delay.
   */
  wait?: number | Ref<number>;
}

/**
 * 处理防抖函数
 * @param fn
 * @param delay
 * @returns
 */
function useDebounceFn<T extends Fn>(fn: T, options?: DebounceOptions) {
  const optionsRef = ref(options || { wait: 1000 });
  const debouncedRef = ref<ReturnType<typeof debounce>>();

  const createDebounced = () => {
    const { wait = 1000 } = optionsRef.value;
    return debounce(fn, wait);
  };

  debouncedRef.value = createDebounced();

  watch(
    () => ({ ...optionsRef.value }),
    (newVal, oldVal) => {
      if (newVal.wait !== oldVal?.wait) {
        if (debouncedRef.value && 'cancel' in debouncedRef.value) {
          (debouncedRef.value as { cancel: () => void }).cancel();
        }
        debouncedRef.value = createDebounced();
      }
    },
    { deep: true },
  );

  onScopeDispose(() => {
    if (debouncedRef.value && 'cancel' in debouncedRef.value) {
      (debouncedRef.value as { cancel: () => void }).cancel();
    }
  });

  return {
    run: ((...args: Parameters<T>) => {
      return debouncedRef.value?.apply(null, args);
    }) as T,

    /**
     * Cancel the invocation of currently debounced function.
     *  `() => void`
     */
    cancel: () => {
      if (debouncedRef.value && 'cancel' in debouncedRef.value) {
        (debouncedRef.value as { cancel: () => void }).cancel();
      }
    },

    /**
     * Immediately invoke currently debounced function.
     *  `() => void`
     */
    flush: () => {
      if (debouncedRef.value && 'flush' in debouncedRef.value) {
        (debouncedRef.value as { flush: () => void }).flush();
      }
    },
    updateOptions: (newOptions: DebounceOptions) => {
      optionsRef.value = { wait: typeof newOptions.wait === 'number' ? newOptions.wait : undefined };
    },
  };
}
export default useDebounceFn;
