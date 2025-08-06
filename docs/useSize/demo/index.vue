<template>
  <div>
    <div ref="divRef">current dom size：width:{{ size?.width }}px-----height:{{ size?.height }}px</div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useSize } from 'zhongjiayao_v3_hooks';

  const divRef = ref();
  const size = useSize(divRef);
</script>
