<template>
  <div>
    <p>Client - x: {{ mouse.clientX }}, y: {{ mouse.clientY }}</p>
    <p>Page - x: {{ mouse.pageX }}, y: {{ mouse.pageY }}</p>
    <p>Screen - x: {{ mouse.screenX }}, y: {{ mouse.screenY }}</p>
  </div>
</template>

<script setup>
  import { useMouse } from 'zhongjiayao_v3_hooks';
  const mouse = useMouse();
</script>
