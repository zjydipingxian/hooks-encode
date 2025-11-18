<template>
  <div>
    <div>body：width:{{ size?.width }}px-----height:{{ size?.height }}px</div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useSize } from 'zhongjiayao_v3_hooks';

  // 修复SSR环境下的document未定义问题
  const size = typeof document !== 'undefined' ? useSize(document.querySelector('body')) : ref({ width: 0, height: 0 });
</script>