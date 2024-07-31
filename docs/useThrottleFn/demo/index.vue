<template>
  <p class="mb10">count: {{ throttleFnValue }}</p>
  <a-button @click="run">Click me</a-button>
</template>

<script setup>
  import { ref } from 'vue';
  import { useThrottleFn } from 'zhongjiayao_v3_hooks';

  const throttleFnValue = ref(1);
  const { run } = useThrottleFn(() => {
    throttleFnValue.value++;
  }, 500);
</script>
