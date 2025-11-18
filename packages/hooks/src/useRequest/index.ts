import { ref, Ref, onUnmounted } from 'vue';

/**
 * useRequest 配置选项
 */
export interface UseRequestOptions<T> {
  /**
   * 是否手动触发请求
   * @default false
   */
  manual?: boolean;

  /**
   * 轮询间隔（毫秒），设置后将启用轮询功能
   */
  pollingInterval?: number;

  /**
   * 轮询是否在页面隐藏时继续
   * @default false
   */
  pollingWhenHidden?: boolean;

  /**
   * 请求失败时的重试次数
   * @default 0
   */
  retryCount?: number;

  /**
   * 重试间隔（毫秒）
   * @default 1000
   */
  retryInterval?: number;

  /**
   * 首次默认执行时，传递给 service 的参数
   */
  defaultParams?: any[];

  /**
   * 初始化的数据
   */
  initialData?: T;

  /**
   * 请求执行前触发
   */
  onBefore?: (...args: any[]) => void;

  /**
   * 请求成功回调
   */
  onSuccess?: (data: T) => void;

  /**
   * 请求失败回调
   */
  onError?: (error: Error) => void;

  /**
   * 请求完成回调（无论成功或失败）
   */
  onFinally?: () => void;
}

/**
 * useRequest 返回结果
 */
export interface UseRequestResult<T> {
  /**
   * 请求返回的数据
   */
  data: Ref<T | undefined>;

  /**
   * 请求错误信息
   */
  error: Ref<Error | undefined>;

  /**
   * 请求加载状态
   */
  loading: Ref<boolean>;

  /**
   * 手动触发请求
   */
  run: (...args: any[]) => Promise<T | undefined>;

  /**
   * 取消请求
   */
  cancel: () => void;

  /**
   * 刷新请求
   */
  refresh: () => Promise<T | undefined>;

  /**
   * 修改数据
   */
  mutate: (data: T | ((oldData: T | undefined) => T)) => void;
}

/**
 * useRequest - 管理异步请求状态
 * @param service 请求函数
 * @param options 配置选项
 * @returns 请求状态和控制方法
 */
function useRequest<T>(service: (...args: any[]) => Promise<T>, options: UseRequestOptions<T> = {}): UseRequestResult<T> {
  const {
    manual = false,
    pollingInterval,
    pollingWhenHidden = false,
    retryCount = 0,
    retryInterval = 1000,
    defaultParams = [],
    initialData,
    onBefore,
    onSuccess,
    onError,
    onFinally,
  } = options;

  // 状态管理
  const data: Ref<T | undefined> = ref(undefined);
  if (initialData !== undefined) {
    data.value = initialData;
  }
  const error: Ref<Error | undefined> = ref(undefined);
  const loading: Ref<boolean> = ref(false);

  // 内部状态
  let stopPollingFlag = false;
  let pollingTimer: ReturnType<typeof setTimeout> | null = null;
  let retryCounter = 0;
  let latestParams: any[] = [];

  // 取消请求
  const cancel = () => {
    stopPollingFlag = true;
    if (pollingTimer) {
      clearTimeout(pollingTimer);
      pollingTimer = null;
    }
  };

  // 修改数据
  const mutate = (newData: T | ((oldData: T | undefined) => T)) => {
    if (typeof newData === 'function') {
      data.value = (newData as (oldData: T | undefined) => T)(data.value);
    } else {
      data.value = newData;
    }
  };

  // 执行请求
  const run = async (...args: any[]): Promise<T | undefined> => {
    // 保存最新参数
    latestParams = args;

    // 触发 onBefore 回调
    onBefore?.(...args);

    if (loading.value) {
      return;
    }

    loading.value = true;
    error.value = undefined;

    try {
      const result = await service(...args);
      data.value = result;
      retryCounter = 0; // 成功后重置重试计数
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      error.value = errorObj;

      // 处理重试逻辑
      if (retryCounter < retryCount) {
        retryCounter++;
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
        return run(...args);
      }

      onError?.(errorObj);
      return undefined;
    } finally {
      loading.value = false;
      onFinally?.();

      // 处理轮询逻辑
      if (pollingInterval && !stopPollingFlag) {
        // 检查是否在浏览器环境中
        if (typeof document !== 'undefined') {
          // 如果需要在页面隐藏时继续轮询，或者页面可见，则继续轮询
          if (pollingWhenHidden || document.visibilityState !== 'hidden') {
            pollingTimer = setTimeout(() => {
              run(...latestParams);
            }, pollingInterval);
          } else {
            // 页面隐藏时，监听 visibilitychange 事件
            const handleVisibilityChange = () => {
              if (document.visibilityState === 'visible') {
                pollingTimer = setTimeout(() => {
                  run(...latestParams);
                }, pollingInterval);
                document.removeEventListener('visibilitychange', handleVisibilityChange);
              }
            };
            document.addEventListener('visibilitychange', handleVisibilityChange);
          }
        } else {
          // 在非浏览器环境中直接轮询
          pollingTimer = setTimeout(() => {
            run(...latestParams);
          }, pollingInterval);
        }
      }
    }
  };

  // 刷新请求
  const refresh = () => {
    return run(...latestParams);
  };

  // 监听 visibilitychange 事件处理轮询
  const handleVisibilityChange = () => {
    if (pollingInterval && !stopPollingFlag) {
      // 检查是否在浏览器环境中
      if (typeof document !== 'undefined') {
        if (document.visibilityState === 'visible' && !loading.value) {
          pollingTimer = setTimeout(() => {
            refresh();
          }, pollingInterval);
        } else if (document.visibilityState === 'hidden' && pollingTimer) {
          clearTimeout(pollingTimer);
          pollingTimer = null;
        }
      }
    }
  };

  // 组件卸载时清理
  onUnmounted(() => {
    cancel();
    // 检查是否在浏览器环境中
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  });

  // 非手动模式下自动执行
  if (!manual) {
    // 使用 setTimeout 确保在组件挂载后执行
    setTimeout(() => {
      run(...defaultParams);
    }, 0);
  }

  // 如果启用了轮询且需要监听页面可见性，则添加事件监听器
  if (pollingInterval && !pollingWhenHidden) {
    // 检查是否在浏览器环境中
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
  }

  return {
    data,
    error,
    loading,
    run,
    cancel,
    refresh,
    mutate,
  };
}

export default useRequest;
