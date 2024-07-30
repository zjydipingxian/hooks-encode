<template>
  <div>窗口宽度: {{ width }}</div>
  <div>窗口高度: {{ height }}</div>
</template>

<script setup>
  import { useWindowSize } from 'zhongjiayao_v3_hooks';

  const { width, height } = useWindowSize();
</script>
