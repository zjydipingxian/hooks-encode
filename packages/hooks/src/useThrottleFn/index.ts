import { Fn, throttle } from '../utils';

const defaultDelay: number = 1000;

/**
 * 处理节流函数
 * @param fn
 * @param delay
 * @returns
 */
function useThrottleFn(fn: Fn, delay?: number) {
  const run = throttle(fn, typeof delay === 'number' ? delay : defaultDelay);
  return { run };
}
export default useThrottleFn;
