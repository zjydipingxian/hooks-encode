/**
 * @description: 锁函数
 * @param {Function} fn 函数
 * @return {Function} 锁函数
 *  类似 vue nextTick 函数，防止重复调用
 */

function useLockFn<T extends unknown[], V>(fn: (...args: T) => Promise<V>): (...args: T) => Promise<V | undefined> {
  let lock = false;
  return async (...args: T) => {
    if (lock) return;
    lock = true;
    try {
      const ret = await fn(...args);
      lock = false;
      return ret;
    } catch (e) {
      lock = false;
      throw e;
    }
  };
}
export default useLockFn;
