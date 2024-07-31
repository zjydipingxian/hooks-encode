<template>
  <div class="box1" ref="root" id="hover-div">{{ isHovering ? 'hover' : 'leaveHover' }}</div>
</template>

<script setup>
  import { useHover } from 'zhongjiayao_v3_hooks';
  import { ref } from 'vue';

  const isHovering = ref(false);
  const root = ref();
  useHover(root, {
    onChange(value) {
      isHovering.value = value;
    },
  });
</script>

<style>
  .box1 {
    border-radius: 5px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    background-color: blanchedalmond;
  }
</style>
