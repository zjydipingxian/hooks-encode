import { nextTick, onMounted, onActivated } from 'vue';

export const inBrowser = typeof window !== 'undefined';

export const supportsPassive = true;

export function raf(fn: FrameRequestCallback): number {
  return inBrowser ? requestAnimationFrame(fn) : -1;
}

export function cancelRaf(id: number) {
  if (inBrowser) {
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
