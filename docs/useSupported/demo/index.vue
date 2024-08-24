<template>
  是否有 Clipboard
  <div>{{ isSupported }}</div>
</template>

<script setup>
  import { useSupported } from 'zhongjiayao_v3_hooks';

  const isSupported = useSupported(() => navigator && 'clipboard' in navigator);

  if (isSupported.value) {
    // do something
    // navigator.clipboard;
  }
</script>
