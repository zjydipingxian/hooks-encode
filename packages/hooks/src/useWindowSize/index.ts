import { ref, Ref } from 'vue';
import { inBrowser } from '../utils';
import useEventListener from '../useEventListener';

let width: Ref<number>;
let height: Ref<number>;

function useWindowSize() {
  if (!width) {
    width = ref(0);
    height = ref(0);

    if (inBrowser) {
      const update = () => {
        width.value = window.innerWidth;
        height.value = window.innerHeight;
      };

      update();

      useEventListener('resize', update, { passive: true });
    }
  }

  return { width, height };
}
export default useWindowSize;
