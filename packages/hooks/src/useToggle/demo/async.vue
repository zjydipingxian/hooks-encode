<template>
  <div class="hello">
    <div class="mb10">{{ state }}</div>
    <a-space>
      <a-button @click="toggle">toggle</a-button>
      <a-button @click="setToggle">setToggle</a-button>
    </a-space>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useToggle } from 'zhongjiayao_v3_hooks';

  const platform = ref('安装 App');
  const platform2 = ref('安装中...');
  const [state, [toggle]] = useToggle(platform, platform2, '不安装');

  setTimeout(() => {
    platform.value = `安装 ios App`;
    platform2.value = '安装中2....';
  }, 3000);

  const setToggle = () => {
    toggle(platform);
  };
</script>
