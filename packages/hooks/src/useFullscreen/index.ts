import { ref, Ref, onMounted } from 'vue';
import useEventListener from '../useEventListener';
import { BasicTarget, getTargetElement } from '../domTarget';

export interface Options {
  onFull?: () => void; // 全屏时的回调
  onExitFull?: () => void; // 退出全屏时的回调
}

export interface Actions {
  setFull: () => void; // 设置全屏
  exitFull: () => void; // 退出全屏
  toggle: () => void; // 切换全屏状态
}

const defaultOptions: Options = {
  onFull: () => {},
  onExitFull: () => {},
};

function useFullscreen(target?: BasicTarget, options?: Options): [isFullscreen: Ref<boolean>, actions: Actions] {
  // 如果存在全屏元素则返回true，否则返回false
  const fullScreenElement = typeof document !== 'undefined' ? !!document.fullscreenElement : false;

  const isFullscreen = ref(fullScreenElement);

  const { onFull, onExitFull } = { ...defaultOptions, ...options };

  let el: HTMLElement = typeof document !== 'undefined' ? document.body : (undefined as any);

  const getEl = () => {
    const element = getTargetElement(target);
    return element as HTMLElement;
  };

  const handler = () => {
    if (isFullscreen.value) {
      onFull && onFull();
    } else {
      onExitFull && onExitFull();
    }
  };

  onMounted(() => {
    const element = getEl();
    if (element) {
      el = element;
    }
  });

  // 只在浏览器环境中添加事件监听器
  if (typeof document !== 'undefined') {
    useEventListener('fullscreenchange', handler, { target: el });
  }

  const actions: Actions = {
    setFull: () => {
      // 在非浏览器环境中直接返回
      if (typeof document === 'undefined') return;

      if (isFullscreen.value) return;
      el.requestFullscreen();
      isFullscreen.value = true;
    },
    exitFull: () => {
      // 在非浏览器环境中直接返回
      if (typeof document === 'undefined') return;

      if (!isFullscreen.value) return;
      document.exitFullscreen();
      isFullscreen.value = false;
    },
    toggle: () => {
      isFullscreen.value ? actions.exitFull() : actions.setFull();
    },
  };

  return [isFullscreen, actions];
}

export default useFullscreen;
