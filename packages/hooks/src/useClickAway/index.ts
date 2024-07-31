import { Ref, unref } from 'vue';
import useEventListener from '../useEventListener';
import { inBrowser } from '../utils';

export type UseClickAwayOptions = {
  eventName?: keyof DocumentEventMap | Array<keyof DocumentEventMap>;
};

function useClickAway(
  target: Element | Ref<Element | undefined> | Array<Element | Ref<Element | undefined>>,
  listener: EventListener,
  options: UseClickAwayOptions = {},
) {
  if (!inBrowser) {
    return;
  }

  // 默认是 click
  const { eventName = 'click' } = options;

  const onClick = (event: Event) => {
    const targets = Array.isArray(target) ? target : [target];
    const isClickAway = targets.every((item) => {
      const element = unref(item);
      return element && !element.contains(event.target as Node);
    });

    if (isClickAway) {
      listener(event);
    }
  };

  const eventNames = Array.isArray(eventName) ? eventName : [eventName];

  // 注册多个事件监听器
  eventNames.forEach((eventName) => {
    useEventListener(eventName, onClick, { target: document });
  });
}

export default useClickAway;
