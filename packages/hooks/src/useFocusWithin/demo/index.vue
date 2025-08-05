<template>
  <div
    ref="divRef"
    :style="{
      padding: '16px',
      backgroundColor: isFocusWithin ? 'rgba(0,0,0,0.65)' : '',
      border: '1px solid gray',
    }"
  >
    <label style="display: block">Input: <a-input /> </label>
    <p>isFocusWithin: {{ isFocusWithin }}</p>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useFocusWithin } from 'zhongjiayao_v3_hooks';

  const divRef = ref(null);

  const isFocusWithin = useFocusWithin(divRef, {
    onFocus: () => {
      console.log('focus');
    },
    onBlur: () => {
      console.log('blur');
    },
    onChange: (isFocusWithin) => {
      console.log('change', isFocusWithin);
    },
  });
  console.log('🚀 ~ isFocusWithin:', isFocusWithin);
</script>
