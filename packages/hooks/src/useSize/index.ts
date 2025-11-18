import { onMounted, reactive, toRefs, Ref } from 'vue';
import useWinResize from '../useWinResize';

import { BasicTarget, getTargetElement } from '../domTarget';

type Size = { width: Readonly<Ref<number>>; height: Readonly<Ref<number>> };

function useSize(target: BasicTarget): Size {
  const size = reactive({
    width: 0,
    height: 0,
  });

  const getSizeInfo = () => {
    // 检查是否在浏览器环境中
    if (typeof document !== 'undefined') {
      const targetDom = getTargetElement(target);
      size.width = targetDom?.clientWidth ?? 0;
      size.height = targetDom?.clientHeight ?? 0;
    }
  };

  useWinResize(getSizeInfo);

  onMounted(() => {
    setTimeout(() => {
      getSizeInfo();
    }, 120);
  });

  return { ...toRefs(size) };
}

export default useSize;
