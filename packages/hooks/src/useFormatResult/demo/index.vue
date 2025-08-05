<template>
  <div>age: {{ age }}</div>
  <div>filter > age 5: {{ formatAge }}</div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useFormatResult } from 'zhongjiayao_v3_hooks';

  const age = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const formatAge = useFormatResult(age, (data) => {
    return data.filter((item) => item > 5);
  });
</script>
