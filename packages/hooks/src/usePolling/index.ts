import { ref, Ref, onBeforeUnmount, nextTick } from 'vue';

/**
 * usePolling 配置选项
 */
export interface UsePollingOptions {
  /**
   * 轮询间隔（毫秒）
   * @default 3000
   */
  interval?: number;

  /**
   * 是否立即执行
   * @default true
   */
  immediate?: boolean;

  /**
   * 错误重试策略
   */
  retry?: {
    /**
     * 最大重试次数
     * @default Infinity
     */
    maxAttempts?: number;

    /**
     * 基础延迟
     * @default 1000
     */
    baseDelay?: number;

    /**
     * 最大延迟
     * @default 30000
     */
    maxDelay?: number;

    /**
     * 抖动范围
     * @default 1000
     */
    jitter?: number;
  };

  /**
   * 轮询条件（返回 false 停止轮询）
   * @default () => true
   */
  condition?: () => boolean;
}

/**
 * usePolling 返回结果
 */
export interface UsePollingResult<T> {
  /**
   * 轮询数据
   */
  data: Ref<T | null>;

  /**
   * 加载状态
   */
  loading: Ref<boolean>;

  /**
   * 错误信息
   */
  error: Ref<Error | null>;

  /**
   * 重试次数
   */
  retryCount: Ref<number>;

  /**
   * 立即执行
   */
  run: () => Promise<void>;

  /**
   * 暂停
   */
  pause: () => void;

  /**
   * 恢复
   */
  resume: () => void;

  /**
   * 停止
   */
  stop: () => void;

  /**
   * 重启
   */
  restart: () => void;

  /**
   * 轮询是否停止
   */
  stopped: Ref<boolean>;

  /**
   * 轮询是否暂停
   */
  paused: Ref<boolean>;
}

/**
 * usePolling - 实时轮询数据
 * @param fn 轮询执行的异步函数
 * @param options 配置选项
 * @returns 轮询状态和控制方法
 */
function usePolling<T>(fn: () => Promise<T>, options: UsePollingOptions = {}): UsePollingResult<T> {
  const { interval = 3000, immediate = true, retry = {}, condition = () => true } = options;

  // 状态管理
  const data = ref<T | null>(null) as Ref<T | null>;
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const retryCount = ref(0);
  const paused = ref(false);
  const stopped = ref(false);

  let timer: ReturnType<typeof setTimeout> | null = null;

  // 指数退避延迟计算
  const getRetryDelay = (attempt: number): number => {
    const { baseDelay = 1000, maxDelay = 30000, jitter = 1000 } = retry;

    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);

    // 添加随机抖动避免惊群效应
    return delay + Math.random() * jitter;
  };

  // 执行轮询函数
  const execute = async () => {
    if (paused.value || stopped.value || !condition()) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const result = await fn();
      data.value = result;
      retryCount.value = 0; // 成功后重置重试次数
    } catch (err) {
      error.value = err as Error;
      retryCount.value++;

      // 检查是否达到最大重试次数
      const maxAttempts = retry.maxAttempts ?? Infinity;
      if (retryCount.value >= maxAttempts) {
        stop();
        return;
      }

      // 使用指数退避策略重试
      const delay = getRetryDelay(retryCount.value);
      timer = setTimeout(execute, delay);
      return;
    } finally {
      loading.value = false;
    }

    // 正常轮询间隔
    timer = setTimeout(execute, interval);
  };

  // 控制方法
  const run = async () => {
    if (timer) {
      clearTimeout(timer);
    }
    await execute();
  };

  const pause = () => {
    paused.value = true;
    if (timer) {
      clearTimeout(timer);
    }
  };

  const resume = () => {
    paused.value = false;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(execute, interval);
  };

  const stop = () => {
    stopped.value = true;
    if (timer) {
      clearTimeout(timer);
    }
  };

  const restart = () => {
    stop();
    paused.value = false;
    stopped.value = false;
    retryCount.value = 0;
    if (immediate) {
      nextTick(() => {
        run();
      });
    }
  };

  // 组件卸载清理
  onBeforeUnmount(() => {
    stop();
  });

  // 初始化
  if (immediate) {
    nextTick(() => {
      run();
    });
  }

  return {
    data,
    loading,
    error,
    retryCount,
    run,
    pause,
    resume,
    stop,
    restart,
    stopped,
    paused,
  };
}

export default usePolling;
