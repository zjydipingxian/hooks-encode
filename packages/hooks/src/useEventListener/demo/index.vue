<template>
  <div>useEventListener</div>
</template>

<script setup>
  import { useEventListener } from 'zhongjiayao_v3_hooks';
  console.log('🚀 ~ useEventListener:', useEventListener);

  // 在 window 上绑定 resize 事件
  // 未指定监听对象时，默认会监听 window 的事件
  useEventListener(
    'click',
    () => {
      console.log('window 111');
    },
    { target: document.body },
  );
</script>
