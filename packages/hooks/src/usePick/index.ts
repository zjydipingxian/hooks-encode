import { Ref, unref } from 'vue';

function usePick<T extends object, K extends keyof T>(obj: Ref<T> | T, keys: K[] | string): Pick<T, K> {
  const result: Partial<T> = {};

  let keySet: Set<K>;

  // 当是 字符串时，将其转换为数组
  if (typeof keys === 'string') {
    // 将字符串转换为 Set 并进行类型验证
    keySet = new Set(keys.split(',').map((key) => key.trim() as K));
  } else {
    keySet = new Set(keys);
  }
  const unrefObJ = unref(obj);

  // 检查 obj 是否为对象
  if (typeof unrefObJ !== 'object' || unrefObJ === null) {
    throw new Error('The provided object is not valid.');
  }

  // 使用 Set 进行高效查找
  for (const key in unrefObJ) {
    if (keySet.has(key as unknown as K)) {
      result[key] = unrefObJ[key];
    }
  }

  return result as Pick<T, K>;
}
export default usePick;
