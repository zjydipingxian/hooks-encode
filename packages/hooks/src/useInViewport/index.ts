import { ref, Ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { getTargetElement, BasicTarget } from '../domTarget';

/**
 * useInViewport 配置选项
 */
export interface UseInViewportOptions extends IntersectionObserverInit {
  /**
   * 根元素的外边距
   * @default '0px'
   */
  rootMargin?: string;

  /**
   * 触发回调的阈值
   * @default 0
   */
  threshold?: number | number[];

  /**
   * 根元素
   * @default null (视口)
   */
  root?: HTMLElement | null;
}

/**
 * useInViewport 返回结果
 */
export interface UseInViewportResult {
  /**
   * 元素是否在视口内
   */
  inViewport: Ref<boolean>;

  /**
   * IntersectionObserver 比率
   */
  ratio: Ref<number>;
}

/**
 * useInViewport - 监听元素是否进入视口
 * @param target 目标元素
 * @param options 配置选项
 * @returns 视口状态和比率
 */
function useInViewport(target: BasicTarget, options: UseInViewportOptions = {}): UseInViewportResult {
  const { rootMargin = '0px', threshold = 0, root = null } = options;

  const inViewport = ref(false);
  const ratio = ref(0);

  let observer: IntersectionObserver | null = null;

  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  const setup = () => {
    cleanup();

    const element = getTargetElement(target);
    if (!element || !(element instanceof HTMLElement)) {
      return;
    }

    // 检查浏览器是否支持 IntersectionObserver
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('IntersectionObserver is not supported in this browser');
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inViewport.value = entry.isIntersecting;
          ratio.value = entry.intersectionRatio;
        });
      },
      {
        root,
        rootMargin,
        threshold,
      },
    );

    observer.observe(element);
  };

  // 如果 target 是 ref，监听其变化
  if (target && typeof target === 'object' && 'value' in target) {
    watch(
      () => (target as Ref).value,
      () => {
        setup();
      },
      { immediate: true },
    );
  } else {
    // 如果在 Vue 组件中，使用生命周期钩子
    try {
      onMounted(setup);
    } catch {
      // 如果不在 Vue 组件中，直接执行
      setup();
    }
  }

  onBeforeUnmount(cleanup);

  return {
    inViewport,
    ratio,
  };
}

export default useInViewport;
