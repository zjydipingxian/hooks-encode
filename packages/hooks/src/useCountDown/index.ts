import { computed, onActivated, onBeforeUnmount, onDeactivated, ref } from 'vue';
import { cancelRaf, inBrowser, raf } from '../utils';

export type CurrentTime = {
  days: number;
  hours: number;
  total: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

export type UseCountDownOptions = {
  time: number;
  millisecond?: boolean;
  onChange?: (current: CurrentTime) => void;
  onFinish?: () => void;
};

// 单位： 毫秒
const SECOND = 1000; // 一秒
const MINUTE = 60 * SECOND; // 一分钟
const HOUR = 60 * MINUTE; // 一个小时
const DAY = 24 * HOUR; // 一天

/**
 * 将时间戳转换为更易读的当前时间对象。
 * @param time 输入的时间戳，单位为毫秒。
 * @returns  返回一个对象，包含总时间、天、小时、分钟、秒和毫秒。
 */
function parseTime(time: number): CurrentTime {
  // 计算总天数
  const days = Math.floor(time / DAY);
  // 计算剩余时间的小时数
  const hours = Math.floor((time % DAY) / HOUR);
  // 计算剩余时间的分钟数
  const minutes = Math.floor((time % HOUR) / MINUTE);
  // 计算剩余时间的秒数
  const seconds = Math.floor((time % MINUTE) / SECOND);
  // 计算剩余时间的毫秒数
  const milliseconds = Math.floor(time % SECOND);

  return {
    total: time,
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}

// 判断两个时间是否相等
function isSameSecond(time1: number, time2: number): boolean {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000);
}

function useCountDown(options: UseCountDownOptions) {
  let rafId: number; // 帧动画id
  let endTime: number; // 结束时间
  let counting: boolean; // 是否正在倒计时
  let deactivated: boolean; // 是否暂停

  const remain = ref(options.time);
  const current = computed(() => parseTime(remain.value));

  // 暂停
  const pause = () => {
    counting = false;
    cancelRaf(rafId);
  };

  // 开始
  const start = () => {
    if (!counting) {
      endTime = Date.now() + remain.value;
      counting = true;
      tick();
    }
  };

  // 重置
  const reset = (totalTime: number = options.time) => {
    pause();
    remain.value = totalTime;
  };

  // 获取剩余时间， 默认为毫秒 超过结束时间 返回 0
  const getCurrentRemain = () => Math.max(endTime - Date.now(), 0);

  // 设置剩余时间
  const setRemain = (value: number) => {
    remain.value = value;
    //   有 onChange 触发
    options.onChange?.(current.value);

    // 如果为0 暂停 并触发onFinish 告知结束了
    if (value === 0) {
      pause();
      options.onFinish?.();
    }
  };

  const microTick = () => {
    rafId = raf(() => {
      if (counting) {
        setRemain(getCurrentRemain());

        if (remain.value > 0) {
          microTick();
        }
      }
    });
  };

  const macroTick = () => {
    rafId = raf(() => {
      if (counting) {
        const remainRemain = getCurrentRemain();

        // 检查当前剩余时间是否与上一次记录的不同，或者已经归零。
        if (!isSameSecond(remainRemain, remain.value) || remainRemain === 0) {
          setRemain(remainRemain);
        }

        // 如果剩余时间仍大于0，则继续调度
        if (remain.value > 0) {
          macroTick();
        }
      }
    });
  };

  const tick = () => {
    // 检查是否在浏览器环境中，
    if (!inBrowser) {
      return;
    }

    // 根据配置选项决定执行毫秒的启动
    if (options.millisecond) {
      microTick();
    } else {
      macroTick();
    }
  };

  onBeforeUnmount(pause);

  // 组件被激活时，重新开始倒计时
  onActivated(() => {
    if (deactivated) {
      counting = true;
      deactivated = false;
      tick();
    }
  });

  // 当组件被暂停或停止活动时调用的函数。
  onDeactivated(() => {
    if (counting) {
      pause();
      deactivated = true;
    }
  });

  return {
    start,
    pause,
    reset,
    current,
  };
}

export default useCountDown;
