<template>
  <div>useEventListener</div>
</template>

<script setup>
  import { useEventListener } from 'zhongjiayao_v3_hooks';

  const cleanup = useEventListener('resize', () => {
    console.log('window resize cleanup');
  });

  cleanup();
</script>
