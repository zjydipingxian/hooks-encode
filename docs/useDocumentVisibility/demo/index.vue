<template>
  <div>{{ documentVisibility }}</div>
</template>

<script setup>
  import { useDocumentVisibility } from 'zhongjiayao_v3_hooks';

  const documentVisibility = useDocumentVisibility();
</script>
