<template>
  <div>submit count: {{ valueRef }}</div>
  <div>start：{{ startRef }}</div>
  <div>success：{{ endRef }}</div>
  <div><a-button type="primary" @click="lockFn"> Submit</a-button></div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useLockFn } from 'zhongjiayao_v3_hooks';

  const valueRef = ref(0);
  const startRef = ref(0);
  const endRef = ref(0);

  function mockUseLockFn() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  const lockFn = useLockFn(async () => {
    startRef.value += 1;
    await mockUseLockFn();
    valueRef.value += 1;
    endRef.value += 1;
  });
</script>
