<template>
  <div>{{ isMounted ? 'mounted' : 'unmounted' }}</div>
</template>

<script setup>
  import { useMounted } from 'zhongjiayao_v3_hooks';
  const isMounted = useMounted();
</script>
