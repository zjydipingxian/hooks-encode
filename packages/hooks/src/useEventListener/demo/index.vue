<template>
  <div>useEventListener</div>
</template>

<script setup>
  import { useEventListener } from 'zhongjiayao_v3_hooks';

  // 在 window 上绑定 resize 事件
  // 未指定监听对象时，默认会监听 window 的事件
  useEventListener('resize', () => {
    console.log('window resize');
  });

  // 在 body 元素上绑定 click 事件
  // 修复SSR环境下的document未定义问题
  if (typeof document !== 'undefined') {
    useEventListener(
      'click',
      () => {
        console.log('click body');
      },
      { target: document.body },
    );
  }
</script>
