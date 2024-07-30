<template>
  <div style="margin-top: 10px">
    <div>总时间：{{ current.total }}</div>
    <div>剩余天数：{{ current.days }}</div>
    <div>剩余小时：{{ current.hours }}</div>
    <div>剩余分钟：{{ current.minutes }}</div>
    <div>剩余秒数：{{ current.seconds }}</div>
    <div>剩余毫秒：{{ current.milliseconds }}</div>
  </div>
</template>

<script setup>
  import { useCountDown } from 'zhongjiayao_v3_hooks';
  const countDown = useCountDown({
    time: 5000,
    millisecond: true,
    onChange(current) {
      console.log('onChange', current);
    },
    onFinish() {
      console.log('onFinish');
    },
  });

  countDown.start();

  const current = countDown.current;
</script>
