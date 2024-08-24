<template>
  <div>granted -允许</div>
  <div>prompt - 询问</div>
  <div>denied - 禁用</div>

  <div>状态：{{ microphoneAccess }}</div>
</template>

<script setup>
  import { usePermission } from 'zhongjiayao_v3_hooks';

  const microphoneAccess = usePermission('microphone');
</script>
