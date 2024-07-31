<template>
  <div class="hello">
    <div ref="fullScreen" style="background: white">
      <p>是否全屏: {{ isFullscreen }}</p>

      <a-space>
        <a-button @click="setFull" id="a">全屏</a-button>
        <a-button @click="exitFull">退出全屏</a-button>
        <a-button @click="toggle">toggle切换</a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup>
  import { useFullscreen } from 'zhongjiayao_v3_hooks';

  const [isFullscreen, { setFull, exitFull, toggle }] = useFullscreen();
</script>
