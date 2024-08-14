<template>
  <div>状态：{{ online ? '在线' : '离线' }}</div>
</template>

<script setup>
  import { useOnline } from 'zhongjiayao_v3_hooks';
  const { online } = useOnline();
</script>
