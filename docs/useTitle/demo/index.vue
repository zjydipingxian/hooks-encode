<template>
  <div>{{ title }}</div>
</template>

<script setup>
  import { ref } from 'vue';

  import { useTitle } from 'zhongjiayao_v3_hooks';

  const title = ref('hello zhongjiayao_v3_hooks');

  useTitle(title, { restoreOnUnmount: true });
</script>
