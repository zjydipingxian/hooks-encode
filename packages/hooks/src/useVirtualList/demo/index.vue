<template>
  <div>
    <a-button style="margin-bottom: 10px" @click="handleVirtualScrollTo"> scroll to </a-button>

    <div
      :ref="containerProps.ref"
      @scroll="containerProps.onScroll"
      style="height: 300px; overflow: auto; border: 1px solid #cccccc"
    >
      <div :style="wrapperStyle">
        <div v-for="active in list" :key="active" style="height: 60px; border-bottom: 1px solid #cccccc; background-color: white">
          {{ active }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useVirtualList } from 'zhongjiayao_v3_hooks';

  const { list, wrapperStyle, containerProps, scrollTo } = useVirtualList(Array.from(Array(100).keys()), {
    itemHeight: 60,
    overscan: 10,
  });

  const handleVirtualScrollTo = () => {
    scrollTo(22);
  };
</script>
