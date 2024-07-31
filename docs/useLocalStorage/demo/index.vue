<template>
  <div class="hello">
    <p>value: {{ state }}</p>

    <a-input v-model:value="state" class="mb10" />

    <a-space style="width: 39vw">
      <a-button @click="handleUpdate">更新storage</a-button>
      <a-button @click="handleDelete">删除storage</a-button>
    </a-space>
  </div>
</template>

<script setup>
  import { useLocalStorage } from 'zhongjiayao_v3_hooks';
  const state = useLocalStorage('useLocalStorage', 'Hello~');

  const handleUpdate = () => {
    state.value = Math.random();
  };

  const handleDelete = () => {
    state.value = undefined;
  };
</script>
