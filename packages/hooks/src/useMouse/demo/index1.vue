<template>
  <div
    ref="domRef"
    :style="{
      width: '200px',
      height: '200px',
      backgroundColor: 'gray',
      opacity: 0.85,
      color: 'white',
      lineHeight: '200px',
      textAlign: 'center',
    }"
  >
    element
  </div>

  <div>
    <p>Mouse In Element - x: {{ mouse.elementX }}, y: {{ mouse.elementY }}</p>
    <p>Element Position - x: {{ mouse.elementPosX }}, y: {{ mouse.elementPosY }}</p>
    <p>Element pageX - x: {{ mouse.pageX }}, y: {{ mouse.pageY }}</p>
    <p>
      Element Dimensions - width: {{ mouse.elementW }}, height:
      {{ mouse.elementH }}
    </p>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useMouse } from 'zhongjiayao_v3_hooks';
  const domRef = ref(null);
  const mouse = useMouse(domRef);
</script>
