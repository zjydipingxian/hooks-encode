import { onMounted, reactive, toRefs, Ref, watch } from 'vue';
import useEventListener from '../useEventListener';
import useResizeObserver from '../useResizeObserver';
import { BasicTarget, getTargetElement } from '../domTarget';

export interface UseElementBoundingOptions {
  /**
   *
   * 组件挂载时是否将所有值初始化为 0
   *
   * @default true
   */
  reset?: boolean;
  /**
   *
   * 是否在窗口调整大小时触发
   *
   * @default true
   */
  windowResize?: boolean;
  /**
   *
   * 是否在窗口滚动时触发
   *
   * @default true
   */
  windowScroll?: boolean;
  /**
   *
   * 是否立即执行一次
   *
   * @default true
   */
  immediate?: boolean;
}

export interface UseElementBoundingReturnType {
  width: Ref<number>;
  height: Ref<number>;
  top: Ref<number>;
  left: Ref<number>;
  bottom: Ref<number>;
  right: Ref<number>;
}

function keyisUseElementBoundingReturnTypeKey(key: string): key is keyof UseElementBoundingReturnType {
  return ['width', 'height', 'top', 'left', 'bottom', 'right'].includes(key);
}

function useElementBounding(target: BasicTarget, options?: UseElementBoundingOptions) {
  const { reset = true, windowResize = true, windowScroll = true, immediate = true } = options ?? {};

  const size = reactive({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  const update = () => {
    const targetDom = getTargetElement(target);

    if (!targetDom) {
      if (reset) {
        Object.keys(size).forEach((key) => {
          if (keyisUseElementBoundingReturnTypeKey(key)) size[key] = 0;
        });
      }

      return;
    }

    if (targetDom) {
      const { width, height, top, left, bottom, right } = targetDom.getBoundingClientRect();

      size.width = width;
      size.height = height;
      size.top = top;
      size.left = left;
      size.bottom = bottom;
      size.right = right;
    }
  };

  if (windowResize) {
    useEventListener('resize', update, {
      passive: true,
    });
  }

  if (windowScroll) {
    useEventListener('scroll', update, {
      capture: true,
      passive: true,
    });
  }

  useResizeObserver(target, update);

  watch(() => getTargetElement(target), update);

  onMounted(() => {
    immediate && update();
  });

  return {
    ...toRefs(size),
  };
}
export default useElementBounding;
