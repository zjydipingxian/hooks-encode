import { onMounted, reactive, toRefs, Ref } from 'vue';
import useWinResize from '../useWinResize';
import { isBrowser } from '../utils';

import { BasicTarget, getTargetElement } from '../domTarget';

type Size = { width: Readonly<Ref<number>>; height: Readonly<Ref<number>> };

function useSize(target: BasicTarget): Size {
  const size = reactive({
    width: 0,
    height: 0,
  });

  const getSizeInfo = () => {
    if (!isBrowser) return;

    // 检查是否在浏览器环境中
    const targetDom = getTargetElement(target);
    size.width = targetDom?.clientWidth ?? 0;
    size.height = targetDom?.clientHeight ?? 0;
  };

  // 只在浏览器环境中使用 useWinResize
  if (isBrowser) {
    useWinResize(getSizeInfo);
  }

  onMounted(() => {
    // 只在浏览器环境中执行
    if (isBrowser) {
      setTimeout(() => {
        getSizeInfo();
      }, 120);
    }
  });

  return { ...toRefs(size) };
}

export default useSize;
