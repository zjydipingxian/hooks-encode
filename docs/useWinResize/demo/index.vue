<template>
  <div>Windows change count： {{ countRef }}</div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useWinResize } from 'zhongjiayao_v3_hooks';

  const countRef = ref(0);
  useWinResize(() => (countRef.value += 1));
</script>
