<template>
  <div>value: {{ valueRef }}</div>
  <a-button style="margin-top: 8px" @click="handleInterval">interval + 1000</a-button>
  <a-button style="margin-left: 8px" @click="resetInterval"> 重置</a-button>
  <a-button style="margin-left: 8px" @click="clear">clear</a-button>
  <a-button style="margin-left: 8px" @click="restart">restart</a-button>
</template>
<script setup>
  import { ref } from 'vue';

  import { useInterval } from 'zhongjiayao_v3_hooks';

  const valueRef = ref(0);
  const intervalRef = ref(2000);
  const { clear, restart } = useInterval(() => {
    valueRef.value += 1;
  }, intervalRef);

  const handleInterval = () => {
    intervalRef.value += 1000;
  };

  const resetInterval = () => {
    intervalRef.value = 2000;
  };
</script>
