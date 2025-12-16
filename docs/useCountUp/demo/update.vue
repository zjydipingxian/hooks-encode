<script setup lang="ts">
import { ref } from 'vue';
import { useCountUp } from 'zhongjiayao_v3_hooks';

const targetValue = ref(1000);

const { current, update } = useCountUp(targetValue.value, {
  duration: 1500,
  easing: 'easeOut',
});

function handleUpdate() {
  targetValue.value = Math.floor(Math.random() * 10000);
  update(targetValue.value);
}
</script>

<template>
  <div class="update-demo">
    <div class="value">{{ current }}</div>
    <div class="target">目标值: {{ targetValue }}</div>
    <button @click="handleUpdate">更新随机值</button>
  </div>
</template>

<style scoped>
.update-demo {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.value {
  font-size: 48px;
  font-weight: bold;
  color: #1890ff;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.target {
  margin: 12px 0;
  color: #999;
}

button {
  padding: 8px 16px;
  border: 1px solid #1890ff;
  border-radius: 4px;
  background: #1890ff;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background: #40a9ff;
}
</style>
