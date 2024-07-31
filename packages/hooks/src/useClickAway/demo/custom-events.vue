<template>
  <div class="box2 mb10" ref="box1">{{ counter }}</div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useClickAway } from 'zhongjiayao_v3_hooks';
  const box1 = ref();
  const counter = ref(0);

  useClickAway(
    box1,
    () => {
      counter.value++;
    },
    { eventName: ['click', 'contextmenu'] },
  );
</script>
<style>
  .box2 {
    border-radius: 5px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    background-color: blanchedalmond;
  }
</style>
