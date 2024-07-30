<template>
  <div class="mb10">useToggleDemoState: {{ useToggleDemoState }}</div>
  <a-space>
    <a-button @click="handleUseTToggle">设置指定值</a-button>
    <a-button @click="useTToggle">useTToggle</a-button>
    <a-button @click="useTSetLeft">useTSetLeft</a-button>
    <a-button @click="useTSetCenter">useTSetCenter</a-button>
    <a-button @click="useTSetRight">useTSetRight</a-button>
  </a-space>
</template>

<script setup>
  import { useToggle } from 'zhongjiayao_v3_hooks';

  const [useToggleDemoState, [useTToggle, useTSetLeft, useTSetCenter, useTSetRight]] = useToggle('left', 'center', 'right');

  const handleUseTToggle = () => {
    useTToggle('right');
  };
</script>
