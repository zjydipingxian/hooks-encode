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
  
  // 修复SSR环境下可能返回undefined的问题
  const microphoneAccess = typeof window !== 'undefined' ? usePermission('microphone', { controls: true }) : null;
  
  if (microphoneAccess && typeof microphoneAccess.query === 'function') {
    microphoneAccess.query().then((res) => {
      state.value = res?.state || '';
      
      // 切换的时候
      if (res && res.onchange) {
        res.onchange = (val) => {
          state.value = val.currentTarget.state;
        };
      }
    });
  }
</script>