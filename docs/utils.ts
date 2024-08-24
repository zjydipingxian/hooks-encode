import { nextTick, onMounted, onActivated } from 'vue';

export const isBrowser = typeof window !== 'undefined';

export function getGlobal<T>() {
  if (isBrowser) return window as unknown as T;
}
export const _global = getGlobal<Window>();

export type Fn = (...[]: any[]) => any;

export const supportsPassive = true;

export function raf(fn: FrameRequestCallback): number {
  return isBrowser ? requestAnimationFrame(fn) : -1;
}

export function cancelRaf(id: number) {
  if (isBrowser) {
    cancelAnimationFrame(id);
  }
}

export function doubleRaf(fn: FrameRequestCallback): void {
  raf(() => raf(fn));
}

export function onMountedOrActivated(hook: () => any) {
  let mounted: boolean;

  onMounted(() => {
    hook();
    nextTick(() => {
      mounted = true;
    });
  });

  onActivated(() => {
    if (mounted) {
      hook();
    }
  });
}

export const getValueType = (defaultValue: unknown): string => {
  // 改进对 null 和 undefined 的检查
  if (defaultValue === null || typeof defaultValue === 'undefined') {
    return 'any';
  }

  if (typeof defaultValue === 'boolean') {
    return 'boolean';
  }

  if (typeof defaultValue === 'string') {
    return 'string';
  }

  // 明确数组和其他对象的区分
  if (Array.isArray(defaultValue)) {
    return 'object';
  }

  if (typeof defaultValue === 'object' && defaultValue !== null) {
    // 对于复杂对象的处理，这里可以根据需要添加更具体的类型判断逻辑
    // 暂时保留为 'object' 类型，但已排除 null 和 undefined
    return 'object';
  }

  if (!Number.isNaN(defaultValue)) {
    // 包括 number, bigint 等
    return 'number';
  }

  // 作为最后的回退类型
  return 'any';
};

type Serializer<T> = {
  read(raw: string): T;
  write(value: T): string;
};

/**
 * 按照类型格式数据的常量Map
 */
export const TypeSerializers: Record<'boolean' | 'object' | 'number' | 'any' | 'string', Serializer<any>> = {
  boolean: {
    read: (v: any) => (v != null ? v === 'true' : null),
    write: (v: any) => String(v),
  },
  object: {
    read: (v: any) => (v ? JSON.parse(v) : null),
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: any) => (v != null ? Number.parseFloat(v) : null),
    write: (v: any) => String(v),
  },
  any: {
    read: (v: any) => (v != null && v !== 'null' ? v : null),
    write: (v: any) => String(v),
  },
  string: {
    read: (v: any) => (v != null ? v : null),
    write: (v: any) => String(v),
  },
};

/**
 * 防抖
 * @param fn
 * @param delay
 * @returns
 */
export const debounce = (fn: Fn, delay: number) => {
  let timer: NodeJS.Timeout | null = null;
  return function (...args: []) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      // @ts-ignore
      fn.call(this, ...args);
    }, delay);
  };
};

/**
 * 节流
 * @param fn
 * @param delay
 * @returns
 */
export const throttle = (fn: Fn, delay: number) => {
  let oldNow = Date.now();
  return function (...args: []) {
    const currNow = Date.now();
    if (currNow - oldNow < delay) return;
    oldNow = currNow;
    // @ts-ignore
    fn.call(this, ...args);
  };
};
