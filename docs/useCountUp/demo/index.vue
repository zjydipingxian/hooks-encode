<template>
  <div class="count-up-demo">
    <div class="demo-section">
      <h4>基础用法</h4>
      <div class="value">{{ current }}</div>
      <div class="status">
        <span v-if="isAnimating">动画中...</span>
        <span v-else-if="isFinished">已完成</span>
      </div>
      <div class="actions">
        <button @click="start()">开始</button>
        <button @click="pause">暂停</button>
        <button @click="resume">恢复</button>
        <button @click="reset">重置</button>
      </div>
    </div>

    <div class="demo-section">
      <h4>金额格式</h4>
      <div class="value money">{{ money }}</div>
    </div>

    <div class="demo-section">
      <h4>百分比</h4>
      <div class="value percent">{{ percent }}</div>
    </div>
  </div>
</template>

<script setup>
  import { useCountUp } from 'zhongjiayao_v3_hooks';

  // 基础用法
  const { current, isAnimating, isFinished, start, pause, resume, reset } = useCountUp(9999, {
    duration: 2500,
    easing: 'easeOut',
  });

  // 带格式化
  const { current: money } = useCountUp(123456.78, {
    decimals: 2,
    prefix: '¥',
    separator: ',',
    duration: 3000,
  });

  // 百分比
  const { current: percent } = useCountUp(98.6, {
    decimals: 1,
    suffix: '%',
    duration: 2000,
  });
</script>

<style scoped>
  .count-up-demo {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
  }

  .demo-section {
    padding: 16px;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    min-width: 200px;
  }

  .demo-section h4 {
    margin: 0 0 12px 0;
    color: #666;
    font-size: 14px;
  }

  .value {
    font-size: 32px;
    font-weight: bold;
    color: #1890ff;
    font-family: 'Helvetica Neue', Arial, sans-serif;
  }

  .value.money {
    color: #52c41a;
  }

  .value.percent {
    color: #722ed1;
  }

  .status {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
  }

  .actions {
    margin-top: 12px;
    display: flex;
    gap: 8px;
  }

  .actions button {
    padding: 4px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    font-size: 12px;
  }

  .actions button:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
</style>
