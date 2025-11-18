import { BasicTarget } from '../domTarget';
import { isBrowser, onMountedOrActivated } from '../utils';
import { isRef, onDeactivated, onUnmounted, unref, watch, type WatchStopHandle } from 'vue';

export type UseEventListenerTarget = BasicTarget<HTMLElement | Element | Window | Document>;

type noop = (...p: unknown[]) => void;

export type UseEventListenerOptions<T extends UseEventListenerTarget = UseEventListenerTarget> = {
  // 目标元素
  target?: T;
  // 是否捕获
  capture?: boolean;
  // 监听器是否应该以被动模式运行。被动监听器不会阻止事件的默认行为，这意味着它们不会调用 preventDefault()
  passive?: boolean;
};

/**
 * 使用自定义hook来添加事件监听器到文档对象上。
 *
 * 它通过使用typescript的泛型来确保传入的事件类型是DocumentEventMap中定义的合法事件类型。
 *
 * @param type 事件类型，必须是DocumentEventMap中定义的事件类型。
 * @param listener 事件处理函数，它将被绑定到指定的事件类型上。
 * @param options 可选的事件监听器选项，如是否在捕获阶段触发事件等。
 */

function useEventListener<K extends keyof HTMLElementEventMap>(
  type: K,
  listener: (event: HTMLElementEventMap[K]) => void,
  options?: UseEventListenerOptions<HTMLElement>,
): () => void;

function useEventListener<K extends keyof DocumentEventMap>(
  type: K,
  listener: (event: DocumentEventMap[K]) => void,
  options?: UseEventListenerOptions<Document>,
): () => void;

function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: UseEventListenerOptions<Window>,
): () => void;

function useEventListener(eventName: string, handler: noop, options: UseEventListenerOptions): void;

function useEventListener(type: string, listener: EventListener, options?: UseEventListenerOptions) {
  // 在非浏览器环境中直接返回
  if (!isBrowser) {
    return () => {};
  }

  const { target = options?.target ? options.target : window, capture = false, passive = false } = {};

  // 是否已经清理过事件监听器。
  let cleaned = false;
  // 事件监听器是否已经添加。
  let attached: boolean;

  const add = (target) => {
    if (cleaned) {
      return;
    }
    const element = unref(target);

    // 如果元素存在且尚未附加监听器，则进行添加
    if (element && !attached) {
      element.addEventListener(type, listener, {
        capture,
        passive,
      });
      attached = true;
    }
  };

  const remove = (target?) => {
    if (cleaned) {
      return;
    }
    const element = unref(target);

    if (element && attached) {
      element.removeEventListener(type, listener, capture);
      attached = false;
    }
  };

  // 只在浏览器环境中添加事件监听器
  if (isBrowser) {
    onUnmounted(() => remove(target));
    onDeactivated(() => remove(target));
    onMountedOrActivated(() => add(target));
  }

  let stopWatch: WatchStopHandle;

  if (isRef(target) && isBrowser) {
    stopWatch = watch(target, (val, oldVal) => {
      remove(oldVal);
      add(val);
    });
  }

  return () => {
    stopWatch?.();
    remove(target);
    cleaned = true;
  };
}

export default useEventListener;
