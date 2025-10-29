<template>
  <div>
    {{ valueRef }}
  </div>
</template>
<script setup>
  import { useTimeout } from 'zhongjiayao_v3_hooks';

  import { ref } from 'vue';

  const valueRef = ref(0);

  useTimeout(
    () => {
      valueRef.value += 1;
    },
    3000,
    {
      immediate: false,
    },
  );
</script>
