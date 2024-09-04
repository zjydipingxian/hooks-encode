import { Ref, unref } from 'vue';

function usePick<T extends object, K extends keyof T>(obj: Ref<T> | T, keys: K[] | string): Pick<T, K> {
  const result: Partial<Pick<T, K>> = {};

  // 当是 字符串时，将其转换为数组
  if (typeof keys === 'string') {
    keys = keys.split(',').map((key) => key.trim()) as K[];
  }

  const unrefObJ = unref(obj);

  for (const key of keys) {
    if (key in unrefObJ) {
      result[key] = unrefObJ[key];
    }
  }

  return result as Pick<T, K>;
}
export default usePick;
