import { computed } from 'vue';
import useMounted from '../useMounted';

function useSupported(callback: () => unknown) {
  const isMounted = useMounted();

  return computed(() => {
    isMounted.value;
    return Boolean(callback());
  });
}
export default useSupported;
