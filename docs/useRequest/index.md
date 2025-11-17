# useRequest

强大的异步请求管理 Hook，它提供了完整的请求状态管理、错误处理、轮询、重试等功能。它可以帮助你轻松处理各种复杂的异步请求场景。

<preview path="./demo/index.vue" title="基本使用" description='useRequest'></preview>

## API

### UseRequestOptions

| 参数              | 说明                                  | 类型                       | 默认值      |
| ----------------- | ------------------------------------- | -------------------------- | ----------- |
| manual            | 是否手动触发请求                      | `boolean`                  | `false`     |
| pollingInterval   | 轮询间隔（毫秒）                      | `number`                   | -           |
| pollingWhenHidden | 轮询是否在页面隐藏时继续              | `boolean`                  | `false`     |
| retryCount        | 请求失败时的重试次数                  | `number`                   | `0`         |
| retryInterval     | 重试间隔（毫秒）                      | `number`                   | `1000`      |
| defaultParams     | 首次默认执行时，传递给 service 的参数 | `any[]`                    | `[]`        |
| initialData       | 初始化的数据                          | `T`                        | `undefined` |
| onBefore          | 请求执行前触发                        | `(...args: any[]) => void` | -           |
| onSuccess         | 请求成功回调                          | `(data: T) => void`        | -           |
| onError           | 请求失败回调                          | `(error: Error) => void`   | -           |
| onFinally         | 请求完成回调                          | `() => void`               | -           |

### UseRequestResult

| 参数    | 说明           | 类型                                                    |
| ------- | -------------- | ------------------------------------------------------- |
| data    | 请求返回的数据 | `Ref<T \| undefined>`                                   |
| error   | 请求错误信息   | `Ref<Error \| undefined>`                               |
| loading | 请求加载状态   | `Ref<boolean>`                                          |
| run     | 手动触发请求   | `(...args: any[]) => Promise<T \| undefined>`           |
| cancel  | 取消请求       | `() => void`                                            |
| refresh | 刷新请求       | `() => Promise<T \| undefined>`                         |
| mutate  | 修改数据       | `(data: T \| ((oldData: T \| undefined) => T)) => void` |

## 使用示例

### 基础请求

```vue
<template>
  <div>
    <p>用户名: {{ data?.name }}</p>
    <p>加载状态: {{ loading ? '加载中' : '空闲' }}</p>
    <button :disabled="loading" @click="run">重新获取</button>
  </div>
</template>

<script setup>
  import useRequest from 'zhongjiayao_v3_hooks';

  const getUserInfo = () => {
    return fetch('/api/user').then((res) => res.json());
  };

  const { data, loading, run } = useRequest(getUserInfo);
</script>
```

### 手动触发请求

```vue
<script setup>
  import { useRequest } from 'zhongjiayao_v3_hooks';

  const createUser = (userData) => {
    return fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify(userData),
    }).then((res) => res.json());
  };

  const { data, loading, run } = useRequest(createUser, {
    manual: true, // 手动触发
  });

  // 手动执行请求
  const handleSubmit = () => {
    run({ name: '张三', email: 'zhangsan@example.com' });
  };
</script>
```

### 轮询请求

```vue
<script setup>
  import { useRequest } from 'zhongjiayao_v3_hooks';

  const getLatestData = () => {
    return fetch('/api/data').then((res) => res.json());
  };

  const { data, loading } = useRequest(getLatestData, {
    pollingInterval: 5000, // 5秒轮询一次
    pollingWhenHidden: false, // 页面隐藏时停止轮询
  });
</script>
```

### 错误重试

```vue
<script setup>
  import { useRequest } from 'zhongjiayao_v3_hooks';

  const fetchData = () => {
    return fetch('/api/data').then((res) => {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    });
  };

  const { data, error, run } = useRequest(fetchData, {
    retryCount: 3, // 最多重试3次
    retryInterval: 2000, // 重试间隔2秒
  });
</script>
```

### 数据修改

```vue
<script setup>
  import { useRequest } from 'zhongjiayao_v3_hooks';

  const getUserList = () => {
    return fetch('/api/users').then((res) => res.json());
  };

  const { data, mutate } = useRequest(getUserList);

  // 直接修改数据
  const updateLocalData = (newData) => {
    mutate(newData);
  };

  // 通过函数修改数据
  const addUser = (user) => {
    mutate((oldData) => [...oldData, user]);
  };
</script>
```

### 初始化数据和默认参数

```vue
<script setup>
  import { useRequest } from 'zhongjiayao_v3_hooks';

  const fetchUserDetail = (userId) => {
    return fetch(`/api/user/${userId}`).then((res) => res.json());
  };

  const { data, loading, run } = useRequest(fetchUserDetail, {
    initialData: { name: '默认用户' }, // 初始化数据
    defaultParams: [123], // 默认参数
    manual: false, // 自动执行，使用默认参数
  });
</script>
```

### 执行前回调

```vue
<script setup>
  import { useRequest } from 'zhongjiayao_v3_hooks';

  const submitForm = (formData) => {
    return fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
    }).then((res) => res.json());
  };

  const { data, loading, run } = useRequest(submitForm, {
    onBefore: (formData) => {
      // 请求执行前的处理
      console.log('准备提交表单:', formData);
    },
    onSuccess: (result) => {
      console.log('提交成功:', result);
    },
    onError: (error) => {
      console.error('提交失败:', error);
    },
  });

  const handleSubmit = (formData) => {
    run(formData);
  };
</script>
```

## 注意事项

1. **自动执行**: 默认情况下，`useRequest` 会在组件挂载时自动执行请求。如果需要手动触发，可以设置 `manual: true`。
2. **轮询优化**: 轮询功能会自动在页面隐藏时暂停，以节省资源。可以通过 `pollingWhenHidden` 参数控制此行为。
3. **错误处理**: 错误信息会存储在 `error` 字段中，请求成功后会自动清空。
4. **内存清理**: 组件卸载时会自动清理定时器和取消未完成的请求，避免内存泄漏。
5. **重试策略**: 重试功能采用固定间隔策略，可以根据需要调整重试次数和间隔时间。
6. **参数传递**: `run` 方法支持传递参数给请求函数，`defaultParams` 用于自动执行时的默认参数。
7. **生命周期回调**: 提供了完整的请求生命周期回调，方便进行各种业务处理。
