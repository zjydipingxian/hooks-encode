<template>
  <p class="mb10">count: {{ debounceFnValue }}</p>
  <a-button @click="run">Click me</a-button>
</template>

<script setup>
  import { ref } from 'vue';
  import { useDebounceFn } from 'zhongjiayao_v3_hooks';

  const debounceFnValue = ref(1);
  const { run } = useDebounceFn(() => {
    debounceFnValue.value++;
  }, 500);
</script>
