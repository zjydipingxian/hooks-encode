import { debounce, Fn } from '../utils';

const defaultDelay: number = 1000;

/**
 * 处理防抖函数
 * @param fn
 * @param delay
 * @returns
 */
function useDebounceFn(fn: Fn, delay?: number) {
  const run = debounce(fn, typeof delay === 'number' ? delay : defaultDelay);
  return { run };
}
export default useDebounceFn;
