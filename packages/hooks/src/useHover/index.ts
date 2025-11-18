import { Ref } from 'vue';
import useBoolean from '../useBoolean/index';
import useEventListener from '../useEventListener';

export interface Options {
  onEnter?: () => void;
  onLeave?: () => void;
  onChange?: (isHovering: boolean) => void;
}

function useHover(target: Element | Ref<Element | undefined>, options?: Options): Ref<boolean> {
  const { onEnter, onLeave, onChange } = options || {};

  const [useBooleanState, { setTrue, setFalse }] = useBoolean(false);

  // 只在浏览器环境中添加事件监听器
  if (typeof document !== 'undefined') {
    useEventListener(
      'mouseover',
      () => {
        onEnter?.();
        setTrue();
        onChange?.(true);
      },
      { target },
    );

    useEventListener(
      'mouseout',
      () => {
        onLeave?.();
        setFalse();
        onChange?.(false);
      },
      { target },
    );
  }

  return useBooleanState;
}

export default useHover;
