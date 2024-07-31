import { isRef, onMounted, ref, Ref } from 'vue';
import useEventListener from '../useEventListener';

interface Options {
  onFull?: () => void;
  onExitFull?: () => void;
}

interface Actions {
  setFull: () => void;
  exitFull: () => void;
  toggle: () => void;
}

type Target = HTMLElement | (() => HTMLElement) | Ref<HTMLElement>;

const defaultOptions = {
  onFull: function () {},
  onExitFull: function () {},
};

function useFullscreen(target?: Target, options?: Options): [isFullscreen: Ref<boolean>, actions: Actions] {
  // 如果存在全屏元素则返回true，否则返回false
  const fullScreenElement = !!document.fullscreenElement;

  const isFullscreen = ref(fullScreenElement);

  const { onFull, onExitFull } = { ...defaultOptions, ...options };

  let el: HTMLElement = document.body;

  const getEl = () => {
    if (typeof target === 'function') {
      return target();
    }
    return isRef(target) ? target.value : target;
  };

  const handler = () => {
    if (isFullscreen.value) {
      onFull();
    } else {
      onExitFull();
    }
  };

  onMounted(() => {
    el = getEl() || el;
  });

  useEventListener('fullscreenchange', handler, { target: el });

  const actions: Actions = {
    setFull: () => {
      if (isFullscreen.value) return;
      el.requestFullscreen();
      isFullscreen.value = true;
    },
    exitFull: () => {
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
