<template>
  <div>{{ userWithoutIdAndEmail }}</div>
</template>

<script setup>
  import { useOmit } from 'zhongjiayao_v3_hooks';

  // 示例用法
  const user = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
  };

  const omittedKeys = ['id', 'email'];

  const userWithoutIdAndEmail = useOmit(user, omittedKeys);
</script>
