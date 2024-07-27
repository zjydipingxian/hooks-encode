<template>
  <div>{{ useBooleanState }}</div>

  <el-button @click="useBooleanToggle">toggle</el-button>
  <button @click="setTrue">setTrue</button>
  <button @click="setFalse">setFalse</button>
  <router-view />
</template>

<script setup>
import { useBoolean } from 'zhongjiayao_v3_hooks'
const [useBooleanState, { toggle: useBooleanToggle, setTrue, setFalse }] = useBoolean()
</script>