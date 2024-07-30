<template>
  <p>{{ useBooleanState }}</p>
  <a-space>
    <a-button @click="useBooleanToggle">toggle</a-button>
    <a-button @click="setTrue">setTrue</a-button>
    <a-button @click="setFalse">setFalse</a-button>
  </a-space>
</template>

<script setup>
  import { useBoolean } from 'zhongjiayao_v3_hooks';
  const [useBooleanState, { toggle: useBooleanToggle, setTrue, setFalse }] = useBoolean();
</script>
