import { ref, Ref } from 'vue';
import { isBrowser } from '../utils';
import useEventListener from '../useEventListener';

type VisibilityState = 'hidden' | 'visible' | 'prerender' | undefined;

const getVisibility = () => {
  if (!isBrowser) {
    return 'visible';
  }
  return document.visibilityState;
};

function useDocumentVisibility(): VisibilityState {
  // 创建一个 ref 来存储文档的可见性状态
  const documentVisibility: Ref<VisibilityState> = ref(getVisibility());

  const handleVisibilityChange = () => {
    if (typeof document !== 'undefined') {
      documentVisibility.value = document.visibilityState;
    }
  };

  // 只在浏览器环境中添加事件监听器
  if (typeof document !== 'undefined') {
    useEventListener('visibilitychange', handleVisibilityChange, { target: document });
  }

  return documentVisibility.value;
}

export default useDocumentVisibility;
