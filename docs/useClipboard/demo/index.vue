<template>
  <a-input v-model:value="inputValue" class="mb10" placeholder="请输入" />
  <a-space class="mb10">
    <a-button @click="copyToClipboard(inputValue)">复制</a-button>
    <a-button @click="readFromClipboard">从剪贴板读取</a-button>
  </a-space>
  <p>剪贴板内容: {{ clipboardContent }}</p>
</template>

<script setup>
  import { ref } from 'vue';
  import { useClipboard } from 'zhongjiayao_v3_hooks';

  const inputValue = ref('');
  const { clipboardContent, copyToClipboard, readFromClipboard } = useClipboard('默认值');
</script>
