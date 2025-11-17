<template>
  <div class="demo-container">
    <h3>useRequest 演示</h3>
    <a-space direction="vertical" :size="16" style="width: 100%">
      <!-- 基础请求 -->
      <a-card title="基础请求">
        <p>获取用户信息</p>

        <a-descriptions :column="2" bordered style="margin-bottom: 16px">
          <a-descriptions-item label="用户名">{{ data?.name || '加载中...' }}</a-descriptions-item>
          <a-descriptions-item label="邮箱">{{ data?.email || '加载中...' }}</a-descriptions-item>
          <a-descriptions-item label="加载状态">{{ loading ? '加载中' : '空闲' }}</a-descriptions-item>
          <a-descriptions-item label="错误信息">{{ error?.message || '无' }}</a-descriptions-item>
        </a-descriptions>

        <a-space>
          <a-button :loading="loading" @click="run">重新获取</a-button>
          <a-button @click="refresh">刷新</a-button>
          <a-button @click="cancel">取消</a-button>
        </a-space>
      </a-card>

      <!-- 轮询请求 -->
      <a-card title="轮询请求">
        <p>每3秒自动获取当前时间</p>

        <a-descriptions :column="2" bordered style="margin-bottom: 16px">
          <a-descriptions-item label="当前时间">{{ pollingData || '加载中...' }}</a-descriptions-item>
          <a-descriptions-item label="加载状态">{{ pollingLoading ? '加载中' : '空闲' }}</a-descriptions-item>
        </a-descriptions>

        <a-space>
          <a-button :loading="pollingLoading" @click="pollingRun">立即执行</a-button>
          <a-button @click="stopPolling">停止轮询</a-button>
        </a-space>
      </a-card>

      <!-- 错误重试 -->
      <a-card title="错误重试">
        <p>模拟网络错误并重试</p>

        <a-descriptions :column="2" bordered style="margin-bottom: 16px">
          <a-descriptions-item label="数据">{{ retryData || '加载中...' }}</a-descriptions-item>
          <a-descriptions-item label="加载状态">{{ retryLoading ? '加载中' : '空闲' }}</a-descriptions-item>
          <a-descriptions-item label="错误信息">{{ retryError?.message || '无' }}</a-descriptions-item>
        </a-descriptions>

        <a-space>
          <a-button :loading="retryLoading" @click="retryRun">执行请求</a-button>
        </a-space>
      </a-card>

      <!-- 新功能演示 -->
      <a-card title="新功能演示">
        <p>初始化数据、默认参数和执行前回调</p>

        <a-descriptions :column="2" bordered style="margin-bottom: 16px">
          <a-descriptions-item label="初始化数据">{{ newFeatureData?.name || '无' }}</a-descriptions-item>
          <a-descriptions-item label="加载状态">{{ newFeatureLoading ? '加载中' : '空闲' }}</a-descriptions-item>
        </a-descriptions>

        <a-space>
          <a-button :loading="newFeatureLoading" @click="newFeatureRun('参数1', '参数2')">执行请求</a-button>
        </a-space>
      </a-card>
    </a-space>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRequest } from 'zhongjiayao_v3_hooks';

  // 1. 基础请求
  const getUserInfo = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: '张三',
          email: 'zhangsan@example.com',
          id: 1,
        });
      }, 1000);
    });
  };

  const { data, loading, error, run, refresh, cancel } = useRequest(getUserInfo);

  // 2. 轮询请求
  const getCurrentTime = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(new Date().toLocaleString());
      }, 500);
    });
  };

  const {
    data: pollingData,
    loading: pollingLoading,
    run: pollingRun,
  } = useRequest(getCurrentTime, {
    pollingInterval: 3000, // 3秒轮询一次
    pollingWhenHidden: false, // 页面隐藏时停止轮询
  });

  // 停止轮询
  const stopPolling = () => {
    // 这里可以通过修改配置来停止轮询
    console.log('停止轮询');
  };

  // 3. 错误重试
  let retryCount = 0;
  const getWithError = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        retryCount++;
        if (retryCount % 3 === 0) {
          // 每三次成功一次
          resolve(`成功数据 - ${new Date().toLocaleTimeString()}`);
        } else {
          reject(new Error(`网络错误 ${retryCount}`));
        }
      }, 800);
    });
  };

  const {
    data: retryData,
    loading: retryLoading,
    error: retryError,
    run: retryRun,
  } = useRequest(getWithError, {
    retryCount: 3, // 最多重试3次
    retryInterval: 1000, // 重试间隔1秒
  });

  // 4. 新功能演示
  const fetchUserData = (param1, param2) => {
    console.log('请求参数:', param1, param2);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: `用户数据 - ${param1}-${param2}`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }, 800);
    });
  };

  const {
    data: newFeatureData,
    loading: newFeatureLoading,
    run: newFeatureRun,
  } = useRequest(fetchUserData, {
    initialData: { name: '默认用户', id: 0 }, // 初始化数据
    defaultParams: ['默认参数1', '默认参数2'], // 默认参数
    onBefore: (param1, param2) => {
      // 执行前回调
      console.log('请求即将执行:', param1, param2);
    },
    manual: true, // 手动触发
  });
</script>
