import { watchEffect, ref, Ref, unref } from 'vue';

interface UseIntervalReturn {
  clear: VoidFunction;
  restart: VoidFunction;
}

function useInterval(
  fn: () => void,
  delay: Ref<number | undefined> | number | undefined,
  options?: { immediate?: boolean },
): UseIntervalReturn {
  const immediate = options?.immediate;

  const fnRef = ref(fn);

  const timerRef = ref<ReturnType<typeof setInterval> | null>(null);

  const setupInterval = () => {
    const delayUnref = unref(delay);

    if (typeof delayUnref !== 'number' || delayUnref < 0) return;

    if (immediate) {
      fnRef.value();
    }

    timerRef.value = setInterval(() => {
      fnRef.value();
    }, delayUnref);
  };

  const clear = () => {
    if (timerRef.value) {
      clearInterval(timerRef.value);
    }
  };

  const restart = () => {
    clear();
    setupInterval();
  };

  watchEffect((onInvalidate) => {
    setupInterval();
    onInvalidate(clear);
  });

  return {
    clear,
    restart,
  };
}
export default useInterval;
