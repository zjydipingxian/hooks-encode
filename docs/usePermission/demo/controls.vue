<template>
  <div>granted -允许</div>
  <div>prompt - 询问</div>
  <div>denied - 禁用</div>

  <div>状态：{{ state }}</div>
</template>

<script setup>
  import { ref } from 'vue';
  import { usePermission } from 'zhongjiayao_v3_hooks';

  const state = ref('');
  const microphoneAccess = usePermission('microphone', { controls: true });
  microphoneAccess.query().then((res) => {
    state.value = res.state;

    // 切换的时候
    res.onchange = (val) => {
      state.value = val.currentTarget.state;
    };
  });
</script>
