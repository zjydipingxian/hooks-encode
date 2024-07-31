<template>
  <div class="hello">
    <p>value: {{ throttleValue }}</p>

    <a-input v-model:value="throttleCurrValue" class="mb10" />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useThrottle } from 'zhongjiayao_v3_hooks';

  const throttleCurrValue = ref(1);
  const throttleValue = useThrottle(throttleCurrValue, 500);
</script>
