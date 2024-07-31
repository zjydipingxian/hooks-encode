import { Ref, unref } from 'vue';
import useBoolean from '../../es/useBoolean/index';
import useEventListener from '../useEventListener';

export interface Options {
  onEnter?: () => void;
  onLeave?: () => void;
  onChange?: (isHovering: boolean) => void;
}
function useHover(target: Element | Ref<Element | undefined>, options?: Options): Ref<boolean> {
  console.log('🚀 ~ useHover ~ target:', target);
  const { onEnter, onLeave, onChange } = options || {};

  const [useBooleanState, { setTrue, setFalse }] = useBoolean(false);

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
  return useBooleanState;
}
export default useHover;
