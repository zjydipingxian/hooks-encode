import { computed, ComputedRef, unref } from 'vue';

import type { Ref } from 'vue';
function useFormatResult<T, FormatResult>(
  data: T | Ref<T>,

  formatResultCallback: (data: T) => FormatResult,
): ComputedRef<FormatResult> {
  return computed(() => {
    return formatResultCallback(unref(data));
  });
}
export default useFormatResult;
