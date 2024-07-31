<template>
  <div class="hello">
    <p>value: {{ debounceValue }}</p>

    <a-input v-model:value="debounceCurrValue" class="mb10" />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useDebounce } from 'zhongjiayao_v3_hooks';

  const debounceCurrValue = ref(1);
  const debounceValue = useDebounce(debounceCurrValue, 500);
</script>
