<template>
  <div class="mb-10" @click="countDown.start()">开始倒计时</div>

  <div>总时间：{{ current.total }}</div>
  <div>剩余天数：{{ current.days }}</div>
  <div>剩余小时：{{ current.hours }}</div>
  <div>剩余分钟：{{ current.minutes }}</div>
  <div>剩余秒数：{{ current.seconds }}</div>
  <div>剩余毫秒：{{ current.milliseconds }}</div>
</template>

<script setup>
  import { useCountDown } from 'zhongjiayao_v3_hooks';
  const countDown = useCountDown({
    // 倒计时 24 小时
    time: 24 * 60 * 60 * 1000,
  });

  const current = countDown.current;
</script>
