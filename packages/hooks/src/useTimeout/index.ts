import { watchEffect, Ref, unref } from 'vue';

function useTimeout(fn: () => void, delay: Ref<number | undefined> | number | undefined, options?: { immediate?: boolean }) {
  const immediate = options?.immediate;

  if (immediate) {
    fn();
  }

  watchEffect((onInvalidate) => {
    if (unref(delay) === undefined || typeof unref(delay) !== 'number' || unref(delay)! < 0) return;

    const _delay = unref(delay);

    const timeout = setTimeout(() => {
      fn();
    }, _delay);

    // 副作用清理：在 delay 变化时或组件卸载时清除定时器
    onInvalidate(() => {
      clearTimeout(timeout);
    });
  });
}
export default useTimeout;
