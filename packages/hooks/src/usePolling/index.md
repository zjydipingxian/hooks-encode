# usePolling

实时轮询数据 Hook，支持自动重试、条件控制、页面可见性优化等功能，适用于订单状态监控、消息通知、实时数据更新等场景。

## 代码演示

<preview path="./demo/index.vue" title="基础使用" description="演示基础轮询、错误重试、条件轮询等功能"></preview>

## API

```typescript
const { data, loading, error, retryCount, run, pause, resume, stop, restart } = usePolling(fn, options);
```

## Params

| 参数    | 说明               | 类型                | 默认值 |
| ------- | ------------------ | ------------------- | ------ |
| fn      | 轮询执行的异步函数 | `() => Promise<T>`  | -      |
| options | 配置选项           | `UsePollingOptions` | -      |

## UsePollingOptions

| 参数      | 说明                            | 类型            | 默认值       |
| --------- | ------------------------------- | --------------- | ------------ |
| interval  | 轮询间隔（毫秒）                | `number`        | `3000`       |
| immediate | 是否立即执行                    | `boolean`       | `true`       |
| retry     | 错误重试策略                    | `RetryOptions`  | -            |
| condition | 轮询条件（返回 false 停止轮询） | `() => boolean` | `() => true` |

## RetryOptions

| 参数        | 说明         | 类型     | 默认值     |
| ----------- | ------------ | -------- | ---------- |
| maxAttempts | 最大重试次数 | `number` | `Infinity` |
| baseDelay   | 基础延迟     | `number` | `1000`     |
| maxDelay    | 最大延迟     | `number` | `30000`    |
| jitter      | 抖动范围     | `number` | `1000`     |

## Result

| 参数       | 说明     | 类型                  |
| ---------- | -------- | --------------------- |
| data       | 轮询数据 | `Ref<T \| null>`      |
| loading    | 加载状态 | `Ref<boolean>`        |
| error      | 错误信息 | `Ref<Error \| null>`  |
| retryCount | 重试次数 | `Ref<number>`         |
| run        | 立即执行 | `() => Promise<void>` |
| pause      | 暂停     | `() => void`          |
| resume     | 恢复     | `() => void`          |
| stop       | 停止     | `() => void`          |
| restart    | 重启     | `() => void`          |

## 使用示例

### 基础轮询

```vue
<template>
  <div>
    <p>当前时间: {{ data }}</p>
    <a-button :loading="loading" @click="run">立即刷新</a-button>
    <a-button @click="pause">暂停</a-button>
    <a-button @click="resume">恢复</a-button>
  </div>
</template>

<script setup>
  import { usePolling } from 'zhongjiayao_v3_hooks';

  const { data, loading, run, pause, resume } = usePolling(
    () => {
      return Promise.resolve(new Date().toLocaleTimeString());
    },
    {
      interval: 5000, // 5秒轮询一次
      immediate: true,
    },
  );
</script>
```

### 订单状态监控

```vue
<script setup>
  import { usePolling } from 'zhongjiayao_v3_hooks';

  const orderId = ref('12345');
  const {
    data: orderStatus,
    loading,
    error,
    stop,
  } = usePolling(() => getOrderStatus(orderId.value), {
    interval: 3000, // 3秒轮询
    retry: {
      maxAttempts: 5, // 最多重试5次
      baseDelay: 1000, // 基础延迟1秒
    },
    condition: () => {
      // 订单未完成时继续轮询
      return !['completed', 'cancelled'].includes(data.value?.status);
    },
  });

  // 订单完成后停止轮询
  watch(orderStatus, (status) => {
    if (['completed', 'cancelled'].includes(status?.status)) {
      stop();
    }
  });
</script>
```

### 错误重试

```vue
<script setup>
  import { usePolling } from 'zhongjiayao_v3_hooks';

  const { data, error, retryCount } = usePolling(fetchUserData, {
    interval: 10000, // 10秒轮询
    retry: {
      maxAttempts: 3, // 最多重试3次
      baseDelay: 1000, // 1秒基础延迟
      maxDelay: 10000, // 最大延迟10秒
      jitter: 1000, // 1秒随机抖动
    },
  });

  // 显示重试信息
  const retryInfo = computed(() => {
    if (retryCount.value > 0) {
      return `重试中... (${retryCount.value}次)`;
    }
    return '';
  });
</script>
```

### 条件轮询

```vue
<script setup>
  import { ref } from 'vue';
  import { usePolling } from 'zhongjiayao_v3_hooks';

  const enabled = ref(true);
  const userId = ref(123);

  const { data } = usePolling(() => fetchUserActivity(userId.value), {
    interval: 5000,
    condition: () => {
      // 只有启用且用户ID有效时才轮询
      return enabled.value && userId.value > 0;
    },
  });

  // 切换轮询状态
  const togglePolling = () => {
    enabled.value = !enabled.value;
  };
</script>
```

### 手动控制

```vue
<script setup>
  import { usePolling } from 'zhongjiayao_v3_hooks';

  const { data, loading, run, pause, resume, stop, restart } = usePolling(fetchData, {
    interval: 5000,
    immediate: false, // 不立即执行
  });

  // 手动控制轮询
  const handleStart = () => run(); // 立即执行
  const handlePause = () => pause(); // 暂停
  const handleResume = () => resume(); // 恢复
  const handleStop = () => stop(); // 停止
  const handleRestart = () => restart(); // 重启
</script>
```
