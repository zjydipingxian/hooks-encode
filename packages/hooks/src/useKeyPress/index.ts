import { ref, Ref, onMounted, onBeforeUnmount } from 'vue';

/**
 * 键盘按键类型
 */
export type KeyType = string | string[];

/**
 * 键盘修饰键
 */
export type ModifierKey = 'ctrl' | 'shift' | 'alt' | 'meta';

/**
 * 按键过滤器
 */
export type KeyFilter = KeyType | ((event: KeyboardEvent) => boolean);

/**
 * 键盘事件类型
 */
export type KeyEvent = 'keydown' | 'keyup';

/**
 * useKeyPress 配置选项
 */
export interface UseKeyPressOptions {
  /**
   * 监听的事件类型
   * @default 'keydown'
   */
  events?: KeyEvent | KeyEvent[];

  /**
   * 目标元素
   * @default window
   */
  target?: HTMLElement | Window | Document | (() => HTMLElement | Window | Document | null);

  /**
   * 是否完全匹配（需要所有修饰键都匹配）
   * @default false
   */
  exactMatch?: boolean;

  /**
   * 是否使用捕获模式
   * @default false
   */
  useCapture?: boolean;
}

/**
 * 别名映射表
 */
const aliasKeyCodeMap: Record<string, string> = {
  esc: 'Escape',
  escape: 'Escape',
  enter: 'Enter',
  return: 'Enter',
  space: ' ',
  spacebar: ' ',
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  delete: 'Delete',
  backspace: 'Backspace',
  tab: 'Tab',
};

/**
 * 修饰键集合
 */
const modifierKeys: Set<string> = new Set(['ctrl', 'shift', 'alt', 'meta', 'control']);

/**
 * 标准化按键
 */
function normalizeKey(key: string): string {
  const lowerKey = key.toLowerCase();
  return aliasKeyCodeMap[lowerKey] || key;
}

/**
 * 判断是否为修饰键
 */
function isModifierKey(key: string): key is ModifierKey {
  return modifierKeys.has(key.toLowerCase());
}

/**
 * 检查事件是否匹配按键
 */
function isKeyMatch(event: KeyboardEvent, keyFilter: KeyFilter, exactMatch: boolean): boolean {
  // 如果是函数，直接调用
  if (typeof keyFilter === 'function') {
    return keyFilter(event);
  }

  // 转换为数组
  const keys = Array.isArray(keyFilter) ? keyFilter : [keyFilter];

  // 分离修饰键和普通键
  const modifiers: Set<ModifierKey> = new Set();
  const normalKeys: string[] = [];

  keys.forEach((key) => {
    const normalized = normalizeKey(key);
    if (isModifierKey(normalized)) {
      modifiers.add(normalized.toLowerCase() as ModifierKey);
    } else {
      normalKeys.push(normalized);
    }
  });

  // 检查修饰键状态
  const eventModifiers: Record<ModifierKey, boolean> = {
    ctrl: event.ctrlKey || event.metaKey, // Mac 上 Cmd 键等同于 Ctrl
    shift: event.shiftKey,
    alt: event.altKey,
    meta: event.metaKey,
  };

  // 精确匹配模式：所有修饰键都必须匹配
  if (exactMatch) {
    for (const mod of ['ctrl', 'shift', 'alt', 'meta'] as ModifierKey[]) {
      const shouldActive = modifiers.has(mod);
      const isActive = eventModifiers[mod];
      if (shouldActive !== isActive) {
        return false;
      }
    }
  } else {
    // 非精确匹配：只要求指定的修饰键处于激活状态
    for (const mod of modifiers) {
      if (!eventModifiers[mod]) {
        return false;
      }
    }
  }

  // 如果没有指定普通键，只检查修饰键
  if (normalKeys.length === 0) {
    return modifiers.size > 0;
  }

  // 检查普通键
  return normalKeys.some((key) => {
    return event.key === key || event.code === key || event.key.toLowerCase() === key.toLowerCase();
  });
}

/**
 * 获取目标元素
 */
function getTargetElement(
  target?: HTMLElement | Window | Document | (() => HTMLElement | Window | Document | null),
): HTMLElement | Window | Document {
  if (!target) {
    return window;
  }

  if (typeof target === 'function') {
    return target() || window;
  }

  return target;
}

/**
 * useKeyPress 返回结果
 */
export interface UseKeyPressReturn {
  pressed: Ref<boolean>;
  cleanup: () => void;
}

/**
 * useKeyPress - 监听键盘按键
 * @param keyFilter 按键过滤器
 * @param onKeyPressed 按键回调
 * @param options 配置选项
 * @returns 当前按键是否按下的响应式状态
 */
function useKeyPress(
  keyFilter: KeyFilter,
  onKeyPressed?: (event: KeyboardEvent) => void,
  options: UseKeyPressOptions = {},
): Ref<boolean> {
  const { events = 'keydown', target, exactMatch = false, useCapture = false } = options;

  const pressed = ref(false);
  const eventsList = Array.isArray(events) ? events : [events];
  let targetElement: HTMLElement | Window | Document | null = null;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isKeyMatch(event, keyFilter, exactMatch)) {
      pressed.value = true;
      onKeyPressed?.(event);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (isKeyMatch(event, keyFilter, exactMatch)) {
      pressed.value = false;
    }
  };

  const cleanup = () => {
    if (targetElement) {
      targetElement.removeEventListener('keydown', handleKeyDown as EventListener, useCapture);
      targetElement.removeEventListener('keyup', handleKeyUp as EventListener, useCapture);
    }
  };

  const setup = () => {
    targetElement = getTargetElement(target);

    eventsList.forEach((eventType) => {
      if (eventType === 'keydown') {
        targetElement!.addEventListener('keydown', handleKeyDown as EventListener, useCapture);
        targetElement!.addEventListener('keyup', handleKeyUp as EventListener, useCapture);
      } else if (eventType === 'keyup') {
        targetElement!.addEventListener('keyup', handleKeyDown as EventListener, useCapture);
      }
    });
  };

  // 如果在 Vue 组件中，使用生命周期钩子
  // 否则直接执行（支持单元测试）
  try {
    onMounted(setup);
    onBeforeUnmount(cleanup);
  } catch {
    // 如果不在 Vue 组件中，直接执行
    setup();
  }

  return pressed;
}

export default useKeyPress;
