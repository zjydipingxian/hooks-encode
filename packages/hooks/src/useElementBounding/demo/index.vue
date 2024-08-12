<template>
  <textarea ref="valueRef" class="resizer" disabled />
  <p>width: {{ width }}</p>
  <p>height: {{ height }}</p>
  <p>left: {{ left }}</p>
  <p>right: {{ right }}</p>
  <p>top: {{ top }}</p>
  <p>bottom: {{ bottom }}</p>
</template>

<script setup>
  import { ref } from 'vue';
  import { useElementBounding } from 'zhongjiayao_v3_hooks';

  const valueRef = ref();
  const { width, height, left, top, right, bottom } = useElementBounding(valueRef);
</script>

<style>
  .resize {
    min-width: 200px;
    min-height: 200px;
    max-width: 500px;
    max-height: 500px;
  }
</style>
