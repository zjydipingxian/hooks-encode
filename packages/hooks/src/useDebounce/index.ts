import { ref, Ref, watch } from 'vue';
import useDebounceFn from '../useDebounceFn';

// 默认值
const defaultDelay: number = 1000;
function useDebounce<T>(value: Ref<T>, delay?: number) {
  delay = delay || defaultDelay;

  const res = ref<T>(value.value) as Ref<T>;

  // 利用useDebounceFn来简化处理值
  const { run } = useDebounceFn(() => (res.value = value.value), { wait: delay });

  watch(value, () => run(), { deep: true });

  return res;
}
export default useDebounce;
