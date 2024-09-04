<template>
  <div>
    isLargeScreen: {{ isLargeScreen }} <br />
    prefersDark: {{ isPreferredDark }}
  </div>
</template>

<script setup>
  import { useMedia } from 'zhongjiayao_v3_hooks';

  const isLargeScreen = useMedia('(min-width: 1024px)');
  const isPreferredDark = useMedia('(prefers-color-scheme: dark)');
</script>
