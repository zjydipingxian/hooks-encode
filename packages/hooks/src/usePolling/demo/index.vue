<template>
  <div class="demo-container">
    <h3>usePolling 演示</h3>
    <a-space direction="vertical" :size="16" style="width: 100%">
      <!-- 基础轮询 -->
      <a-card title="基础轮询">
        <p>每3秒自动获取当前时间</p>

        <a-descriptions :column="2" bordered style="margin-bottom: 16px">
          <a-descriptions-item label="当前时间">{{ data || '加载中...' }}</a-descriptions-item>
          <a-descriptions-item label="加载状态">{{ loading ? '加载中' : '空闲' }}</a-descriptions-item>
          <a-descriptions-item label="重试次数">{{ retryCount }}</a-descriptions-item>
        </a-descriptions>

        <a-space>
          <a-button :loading="loading" @click="run">立即执行</a-button>
          <a-button :disabled="paused || stopped" @click="pause">暂停</a-button>
          <a-button :disabled="!paused" @click="resume">恢复</a-button>
          <a-button @click="stop">停止</a-button>
          <a-button @click="restart">重启</a-button>
        </a-space>
      </a-card>

      <!-- 错误重试 -->
      <a-card title="错误重试">
        <p>模拟网络错误，自动重试机制</p>

        <a-alert v-if="errorData" :message="`错误: ${errorData.message}`" type="error" style="margin-bottom: 16px" />

        <a-descriptions :column="2" bordered style="margin-bottom: 16px">
          <a-descriptions-item label="重试次数">{{ errorRetryCount }}</a-descriptions-item>
          <a-descriptions-item label="最大重试">{{ maxAttempts }}</a-descriptions-item>
        </a-descriptions>

        <a-space>
          <a-button :loading="errorLoading" @click="runError">触发错误</a-button>
          <a-button @click="resetError">重置</a-button>
        </a-space>
      </a-card>

      <!-- 条件轮询 -->
      <a-card title="条件轮询">
        <p>只有满足条件时才继续轮询</p>

        <a-space style="margin-bottom: 16px">
          <a-switch v-model:checked="conditionEnabled" checked-children="启用" un-checked-children="禁用" />
          <span>条件开关: {{ conditionEnabled ? '启用' : '禁用' }}</span>
        </a-space>

        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="轮询数据">{{ conditionData || '无数据' }}</a-descriptions-item>
        </a-descriptions>
      </a-card>
    </a-space>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { usePolling } from 'zhongjiayao_v3_hooks';

  // 1. 基础轮询
  const { data, loading, retryCount, run, pause, resume, stop, restart } = usePolling(
    () => {
      return Promise.resolve(new Date().toLocaleTimeString());
    },
    {
      interval: 3000,
      immediate: false,
    },
  );

  // 2. 错误重试
  let errorTriggered = false;
  const maxAttempts = ref(3);

  const {
    data: errorData,
    loading: errorLoading,
    error: errorError,
    retryCount: errorRetryCount,
    run: runError,
    restart: resetError,
  } = usePolling(
    () => {
      // 模拟错误
      if (!errorTriggered) {
        errorTriggered = true;
        return Promise.reject(new Error('网络连接失败'));
      }
      return Promise.resolve('请求成功: ' + new Date().toLocaleTimeString());
    },
    {
      interval: 2000,
      immediate: false,
      retry: {
        maxAttempts: maxAttempts.value,
        baseDelay: 1000,
        maxDelay: 5000,
      },
    },
  );

  // 3. 条件轮询
  const conditionEnabled = ref(true);
  const { data: conditionData } = usePolling(
    () => {
      return Promise.resolve('条件满足: ' + new Date().toLocaleTimeString());
    },
    {
      interval: 2000,
      immediate: true,
      condition: () => conditionEnabled.value,
    },
  );
</script>

<style scoped>
  .demo-container {
    padding: 20px;
  }
</style>
