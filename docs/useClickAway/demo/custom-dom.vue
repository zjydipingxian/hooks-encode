<template>
  <div class="box2 mb10" id="use-click-away" ref="box1">{{ counter }}</div>
  <div class="box2" id="use-click-away" ref="box2">{{ box2Counter }}</div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useClickAway } from 'zhongjiayao_v3_hooks';
  const box1 = ref();
  const box2 = ref();
  const counter = ref(0);
  const box2Counter = ref(0);

  useClickAway([box1, box2], () => {
    counter.value++;
    box2Counter.value++;
  });
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
