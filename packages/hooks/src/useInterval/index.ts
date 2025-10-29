import { watchEffect, ref, Ref, isRef, unref } from 'vue';

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
    if (isRef(delay)) {
      if (typeof delay.value !== 'number' || delay.value < 0) return;
    } else {
      if (typeof delay !== 'number' || delay < 0) return;
    }

    if (immediate) {
      fnRef.value();
    }

    const _delay = unref(delay);
    timerRef.value = setInterval(() => {
      fnRef.value();
    }, _delay);
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
