import useEventListener from '../useEventListener';
import useBoolean from '../useBoolean';
import { BasicTarget } from '../domTarget';

export interface UseFocusWithinOptions {
  /**
   * 监听的元素
   * @default document
   */

  // eslint-disable-next-line no-unused-vars
  onFocus?: (e: FocusEvent) => void;
  /**
   * 监听的元素
   * @default document
   */
  // eslint-disable-next-line no-unused-vars
  onBlur?: (e: FocusEvent) => void;

  // eslint-disable-next-line no-unused-vars
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
