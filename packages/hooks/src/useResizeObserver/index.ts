import { watch, ref, computed, Ref, getCurrentScope, onScopeDispose } from 'vue';

import { BasicTarget, getTargetElement } from '../domTarget';

export type ResizeObserverCallback = (entries: ReadonlyArray<ResizeObserverEntry>, ob: ResizeObserver) => void;

export interface UseResizeObserverOptions {
  /**
   *
   *
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions;
}

export interface UseResizeObserverReturnType {
  isSupported: Ref<boolean>;
  stop: () => void;
}

function useResizeObserver(
  target: BasicTarget | BasicTarget[],
  callback: ResizeObserverCallback,
  options?: UseResizeObserverOptions,
): UseResizeObserverReturnType {
  const { box = 'content-box', ...argsOptions } = options ?? {};

  // 判断浏览器是否支持 这个 ResizeObserver Api
  const isSupported = ref(typeof window !== 'undefined' && 'ResizeObserver' in window);
  let ob: ResizeObserver | null;

  const modelTargets = computed(() =>
    Array.isArray(target) ? target.map((curr) => getTargetElement(curr)) : [getTargetElement(target)],
  );

  // 取消特定观察者目标上所有对 Element 的监听
  const dispose = () => {
    if (ob) {
      ob.disconnect();
      ob = null;
    }
  };

  const watcher = watch(
    modelTargets,
    (elements) => {
      dispose();

      if (isSupported.value && typeof window !== 'undefined') {
        ob = new ResizeObserver(callback);

        elements.forEach((curr) => {
          curr &&
            ob!.observe(curr, {
              box,
              ...argsOptions,
            });
        });
      }
    },
    {
      flush: 'post',
      immediate: true,
    },
  );

  const stop = () => {
    dispose();
    watcher();
  };

  if (getCurrentScope()) {
    onScopeDispose(stop);
  }

  return {
    isSupported,
    stop,
  };
}

export default useResizeObserver;
