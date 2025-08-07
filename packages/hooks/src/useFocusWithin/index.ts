import useEventListener from '../useEventListener';
import useBoolean from '../useBoolean';
import { BasicTarget } from '../domTarget';

export interface UseFocusWithinOptions {
  /**
   * 监听的元素
   * @default document
   */

  onFocus?: (e: FocusEvent) => void;
  /**
   * 监听的元素
   * @default document
   */

  onBlur?: (e: FocusEvent) => void;

  onChange?: (isFocusWithin: boolean) => void;
}

function useFocusWithin(target: BasicTarget, options?: UseFocusWithinOptions) {
  const [isFocusWithin, { setTrue, setFalse }] = useBoolean(false);

  const { onFocus, onBlur, onChange } = options || {};

  useEventListener(
    'focusin',
    (e: FocusEvent) => {
      if (!isFocusWithin.value) {
        onFocus?.(e);
        onChange?.(true);
        setTrue();
      }
    },
    {
      target,
    },
  );

  useEventListener(
    'focusout',
    (e: FocusEvent) => {
      if (isFocusWithin.value && !(e.currentTarget as Node)?.contains?.(e.relatedTarget as Node)) {
        onBlur?.(e);
        onChange?.(false);
        setFalse();
      }
    },
    {
      target,
    },
  );

  return isFocusWithin;
}
export default useFocusWithin;
