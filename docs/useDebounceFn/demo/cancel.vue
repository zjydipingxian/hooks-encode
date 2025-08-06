<template>
  <p class="mb10">count: {{ debounceFnValue }}</p>
  <a-button @click="() => (wait = 3000)">Update time 3000ms</a-button>
  <a-button style="margin-left: 10px" @click="cancel">取消</a-button>
  <a-button style="margin-left: 10px" @click="run">Click me</a-button>
</template>

<script setup>
  import { ref } from 'vue';
  import { useDebounceFn } from 'zhongjiayao_v3_hooks';

  const debounceFnValue = ref(1);
  const wait = ref(1000);
  const { run, cancel } = useDebounceFn(
    () => {
      debounceFnValue.value++;
    },
    {
      wait: wait,
    },
  );
</script>
