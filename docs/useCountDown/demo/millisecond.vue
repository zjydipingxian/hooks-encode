<template>
  <a-button @click="countDown.start()">开始倒计时</a-button>

  <div style="margin-top: 10px">总时间：{{ current }}</div>
</template>

<script setup>
  import { useCountDown } from 'zhongjiayao_v3_hooks';
  import { ref } from 'vue';

  const current = ref({});

  const countDown = useCountDown({
    // 倒计时 24 小时
    time: 24 * 60 * 60 * 1000,
    millisecond: true,
  });

  current.value = countDown.current;
</script>
