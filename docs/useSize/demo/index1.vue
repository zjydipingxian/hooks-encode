<template>
  <div>
    <div>body：width:{{ size?.width }}px-----height:{{ size?.height }}px</div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useSize } from 'zhongjiayao_v3_hooks';

  const size = useSize(document.querySelector('body'));
</script>
