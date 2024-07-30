<template>
  <div class="mb-10" ref="root">useRect</div>
  <div>{{ rect }}</div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRect } from 'zhongjiayao_v3_hooks';

  const root = ref();
  const rect = ref(null);

  onMounted(() => {
    rect.value = useRect(root);
    console.log(rect); // -> 元素的大小及其相对于视口的位置
  });
</script>
