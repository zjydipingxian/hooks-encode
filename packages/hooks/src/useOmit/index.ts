import { Ref, unref } from 'vue';

function useOmit<T extends object, K extends keyof T>(obj: Ref<T> | T, keys: K[] | string): Omit<T, K> {
  const result: Partial<T> = {};

  let keySet: Set<K>;

  if (typeof keys === 'string') {
    // 将字符串转换为 Set 并进行类型验证
    keySet = new Set(keys.split(',').map((key) => key.trim() as K));
  } else {
    keySet = new Set(keys);
  }

  // 使用 unref 处理 obj
  const unrefOmit = unref(obj);

  // 检查 obj 是否为对象
  if (typeof unrefOmit !== 'object' || unrefOmit === null) {
    throw new Error('The provided object is not valid.');
  }

  // 使用 Set 进行高效查找
  for (const key in unrefOmit) {
    if (!keySet.has(key as unknown as K)) {
      result[key] = unrefOmit[key];
    }
  }

  return result as Omit<T, K>;
}
export default useOmit;
