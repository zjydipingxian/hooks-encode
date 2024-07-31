import { ref, Ref, watch } from 'vue';
import useThrottleFn from '../useThrottleFn';

// 默认值
const defaultDelay: number = 1000;

/**
 * 处理节流值
 * @param value
 * @param delay
 * @returns
 */
function useThrottle<T>(value: Ref<T>, delay?: number) {
  delay = delay || defaultDelay;

  const res = ref<T>(value.value) as Ref<T>;

  // 利用useThrottleFn来简化处理值
  const { run } = useThrottleFn(() => (res.value = value.value), delay);

  watch(value, () => run(), { deep: true });

  return res;
}
export default useThrottle;
