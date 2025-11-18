import { computed } from 'vue';
import useMounted from '../useMounted';

function useSupported(callback: () => unknown) {
  const isMounted = useMounted();

  return computed(() => {
    // 在SSR环境中直接返回false
    if (typeof window === 'undefined') return false;

    isMounted.value;
    return Boolean(callback());
  });
}

export default useSupported;
