import { ref, Ref, isRef, watch as vueWatch } from 'vue';

import { getValueType, isBrowser, TypeSerializers } from '../utils';

const storage = isBrowser ? localStorage : null;

interface Options {
  watch: boolean;
}

const defaultOptions = {
  watch: true,
};

function useSessionStorage<T = unknown>(key: string, initialValue?: T | Ref<T>, options?: Options) {
  const { watch } = { ...defaultOptions, ...options };

  const data = ref() as Ref<T | undefined | null>;
  try {
    if (initialValue !== undefined) {
      data.value = isRef(initialValue) ? initialValue.value : initialValue;
    } else {
      data.value = JSON.parse(storage?.getItem(key) || '{}');
    }
  } catch (error) {
    console.log(error, 'sessionStorage初始化失败');
  }

  const type = getValueType(data.value);

  // 判断类型取格式化方法
  const serializer = TypeSerializers[type];

  const setStorage = () => storage?.setItem(key, serializer.write(data.value));

  // 状态监听
  if (watch) {
    vueWatch(
      data,
      (newValue) => {
        if (newValue === undefined || newValue === null) {
          storage?.removeItem(key);
          return;
        }
        setStorage();
      },
      {
        deep: true,
      },
    );
  }

  setStorage();

  return data;
}
export default useSessionStorage;
