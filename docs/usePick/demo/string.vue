<template>
  原始值： {{ user }}

  <div>{{ selectedUser }}</div>
</template>

<script setup>
  import { ref } from 'vue';
  import { usePick } from 'zhongjiayao_v3_hooks';

  // 示例用法
  const user = ref({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
  });

  const selectedUser = usePick(user, 'id, name, email');

  // or

  // const selectedUser = usePick(user, 'id');
</script>
