import useEventListener from '../useEventListener';
import { BasicTarget, getTargetElement } from '../domTarget';
import { readonly, ref } from 'vue';

/**
 * 鼠标位置状态接口
 * @interface UseMouseCursorState
 * @property {number} screenX - 鼠标指针相对于全局（屏幕）的X坐标
 * @property {number} screenY - 鼠标指针相对于全局（屏幕）的Y坐标
 * @property {number} clientX - 鼠标指针相对于浏览器窗口的X坐标
 * @property {number} clientY - 鼠标指针相对于浏览器窗口的Y坐标
 * @property {number} pageX - 鼠标指针相对于整个页面的X坐标
 * @property {number} pageY - 鼠标指针相对于整个页面的Y坐标
 * @property {number} elementX - 鼠标指针相对于目标元素的X坐标
 * @property {number} elementY - 鼠标指针相对于目标元素的Y坐标
 * @property {number} elementH - 目标元素的高度
 * @property {number} elementW - 目标元素的宽度
 * @property {number} elementPosX - 目标元素相对于视口的X坐标
 * @property {number} elementPosY - 目标元素相对于视口的Y坐标
 */
export interface UseMouseCursorState {
  screenX: number;
  screenY: number;
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  elementX: number;
  elementY: number;
  elementH: number;
  elementW: number;
  elementPosX: number;
  elementPosY: number;
}

/**
 * 鼠标位置状态的初始值
 * 所有属性初始化为NaN，表示尚未获取到有效值
 */
const initState: UseMouseCursorState = {
  screenX: NaN,
  screenY: NaN,
  clientX: NaN,
  clientY: NaN,
  pageX: NaN,
  pageY: NaN,
  elementX: NaN,
  elementY: NaN,
  elementH: NaN,
  elementW: NaN,
  elementPosX: NaN,
  elementPosY: NaN,
};

function useMouse(target?: BasicTarget) {
  const state = ref(initState);

  useEventListener(
    'mousemove',
    (event: MouseEvent) => {
      const { screenX, screenY, clientX, clientY, pageX, pageY } = event;
      const newState = {
        screenX,
        screenY,
        clientX,
        clientY,
        pageX,
        pageY,
        elementX: NaN,
        elementY: NaN,
        elementH: NaN,
        elementW: NaN,
        elementPosX: NaN,
        elementPosY: NaN,
      };
      const targetElement = getTargetElement(target);
      if (targetElement) {
        const { left, top, width, height } = targetElement.getBoundingClientRect();
        newState.elementPosX = left + window.pageXOffset;
        newState.elementPosY = top + window.pageYOffset;
        newState.elementX = pageX - newState.elementPosX;
        newState.elementY = pageY - newState.elementPosY;
        newState.elementW = width;
        newState.elementH = height;
      }
      state.value = newState;
    },
    {
      target: document,
    },
  );

  return readonly(state);
}
export default useMouse;
