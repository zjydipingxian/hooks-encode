import { ref, computed, watch, onBeforeUnmount, onActivated, onDeactivated, unref } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { raf, cancelRaf, isBrowser } from '../utils';

/**
 * 缓动函数类型
 */
export type EasingFunction = (t: number) => number;

/**
 * 缓动函数名称
 */
export type EasingName = 'linear' | 'easeOut' | 'easeInOut' | 'easeOutExpo';

/**
 * useCountUp 配置选项
 */
export interface UseCountUpOptions {
  /**
   * 起始值
   * @default 0
   */
  startValue?: number;

  /**
   * 动画时长（毫秒）
   * @default 2000
   */
  duration?: number;

  /**
   * 是否自动开始
   * @default true
   */
  autoplay?: boolean;

  /**
   * 缓动函数
   * @default 'easeOut'
   */
  easing?: EasingName | EasingFunction;

  /**
   * 小数位数
   * @default 0
   */
  decimals?: number;

  /**
   * 千分位分隔符
   * @default ','
   */
  separator?: string;

  /**
   * 小数点符号
   * @default '.'
   */
  decimal?: string;

  /**
   * 前缀
   * @default ''
   */
  prefix?: string;

  /**
   * 后缀
   * @default ''
   */
  suffix?: string;

  /**
   * 动画完成回调
   */
  onFinish?: () => void;

  /**
   * 动画更新回调
   */
  onUpdate?: (value: number, formatted: string) => void;
}

/**
 * useCountUp 返回值
 */
export interface UseCountUpReturn {
  /** 当前格式化后的显示值 */
  current: ComputedRef<string>;
  /** 当前原始数值 */
  currentValue: Ref<number>;
  /** 是否正在动画中 */
  isAnimating: Ref<boolean>;
  /** 动画是否已完成 */
  isFinished: Ref<boolean>;
  /** 开始动画 */
  start: (endValue?: number) => void;
  /** 暂停动画 */
  pause: () => void;
  /** 恢复动画 */
  resume: () => void;
  /** 重置动画 */
  reset: () => void;
  /** 更新目标值并继续动画 */
  update: (newEndValue: number) => void;
}

/**
 * 内置缓动函数
 */
const easings: Record<EasingName, EasingFunction> = {
  // 线性
  linear: (t: number) => t,
  // 缓出（开始快，结束慢）
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  // 缓入缓出
  easeInOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  // 指数缓出（更强的缓出效果）
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};

/**
 * 格式化数字
 */
function formatNumber(
  value: number,
  decimals: number,
  decimal: string,
  separator: string,
  prefix: string,
  suffix: string,
): string {
  // 处理小数位
  const fixedValue = value.toFixed(decimals);
  const [intPart, decPart] = fixedValue.split('.');

  // 添加千分位分隔符
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  // 拼接结果
  let result = formattedInt;
  if (decimals > 0 && decPart) {
    result += decimal + decPart;
  }

  return prefix + result + suffix;
}

/**
 * useCountUp - 数字滚动动画 Hook
 * @param endValue 目标值
 * @param options 配置选项
 */
function useCountUp(endValue: number | Ref<number>, options: UseCountUpOptions = {}): UseCountUpReturn {
  const {
    startValue = 0,
    duration = 2000,
    autoplay = true,
    easing = 'easeOut',
    decimals = 0,
    separator = ',',
    decimal = '.',
    prefix = '',
    suffix = '',
    onFinish,
    onUpdate,
  } = options;

  // 获取缓动函数
  const easingFn: EasingFunction = typeof easing === 'function' ? easing : easings[easing] || easings.easeOut;

  // 状态
  const currentValue = ref(startValue);
  const isAnimating = ref(false);
  const isFinished = ref(false);

  // 内部状态
  let rafId: number = -1;
  let startTime: number = 0;
  let pausedTime: number = 0;
  let pausedProgress: number = 0;
  let targetValue: number = unref(endValue);
  let animationStartValue: number = startValue;
  let deactivated: boolean = false;

  // 格式化后的当前值
  const current = computed(() => {
    return formatNumber(currentValue.value, decimals, decimal, separator, prefix, suffix);
  });

  // 取消动画帧
  const cancelAnimation = () => {
    if (rafId !== -1) {
      cancelRaf(rafId);
      rafId = -1;
    }
  };

  // 动画循环
  const animate = (timestamp: number) => {
    if (!isAnimating.value) return;

    if (startTime === 0) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime + pausedProgress * duration;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFn(progress);

    // 计算当前值
    const diff = targetValue - animationStartValue;
    currentValue.value = animationStartValue + diff * easedProgress;

    // 触发更新回调
    onUpdate?.(currentValue.value, current.value);

    if (progress < 1) {
      rafId = raf(animate);
    } else {
      // 确保最终值精确
      currentValue.value = targetValue;
      isAnimating.value = false;
      isFinished.value = true;
      onFinish?.();
    }
  };

  // 开始动画
  const start = (newEndValue?: number) => {
    if (!isBrowser) return;

    if (newEndValue !== undefined) {
      targetValue = newEndValue;
    }

    cancelAnimation();
    startTime = 0;
    pausedProgress = 0;
    animationStartValue = currentValue.value;
    isAnimating.value = true;
    isFinished.value = false;

    rafId = raf(animate);
  };

  // 暂停动画
  const pause = () => {
    if (!isAnimating.value) return;

    cancelAnimation();
    pausedTime = performance.now();

    // 计算已经进行的进度
    if (startTime > 0) {
      pausedProgress = Math.min((pausedTime - startTime) / duration + pausedProgress, 1);
    }

    isAnimating.value = false;
  };

  // 恢复动画
  const resume = () => {
    if (isAnimating.value || isFinished.value) return;
    if (!isBrowser) return;

    isAnimating.value = true;
    startTime = 0; // 重置开始时间，在 animate 中重新获取

    rafId = raf(animate);
  };

  // 重置动画
  const reset = () => {
    cancelAnimation();
    currentValue.value = startValue;
    animationStartValue = startValue;
    targetValue = unref(endValue);
    startTime = 0;
    pausedProgress = 0;
    isAnimating.value = false;
    isFinished.value = false;
  };

  // 更新目标值
  const update = (newEndValue: number) => {
    animationStartValue = currentValue.value;
    targetValue = newEndValue;
    startTime = 0;
    pausedProgress = 0;
    isAnimating.value = true;
    isFinished.value = false;

    cancelAnimation();
    rafId = raf(animate);
  };

  // 监听 endValue 变化（如果是 Ref）
  watch(
    () => unref(endValue),
    (newVal) => {
      if (newVal !== targetValue) {
        update(newVal);
      }
    },
  );

  // 组件激活时恢复
  onActivated(() => {
    if (deactivated && !isFinished.value) {
      deactivated = false;
      resume();
    }
  });

  // 组件停用时暂停
  onDeactivated(() => {
    if (isAnimating.value) {
      pause();
      deactivated = true;
    }
  });

  // 组件卸载时清理
  onBeforeUnmount(() => {
    cancelAnimation();
  });

  // 自动开始
  if (autoplay && isBrowser) {
    // 使用 setTimeout 确保在组件挂载后执行
    setTimeout(() => {
      start();
    }, 0);
  }

  return {
    current,
    currentValue,
    isAnimating,
    isFinished,
    start,
    pause,
    resume,
    reset,
    update,
  };
}

export default useCountUp;
