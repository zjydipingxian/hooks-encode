<template>
  <div>单击按钮调整框的大小以查看更改</div>
  <div>浏览器是否支持： {{ isSupported }}</div>

  <a-space>
    <a-button @click="handleCols"> col+1</a-button>
    <a-button @click="handleRows"> row+1 </a-button>
    <a-button @click="stop"> 停止</a-button>
  </a-space>
  <div style="margin: 10px">
    <textarea ref="valueRef" class="resizer" :rows="rows" :cols="cols" disabled v-text="`width: ${width}\nheight: ${height}`" />
  </div>
</template>

<script setup>
  import { ref, toRefs, reactive } from 'vue';
  import { useResizeObserver } from 'zhongjiayao_v3_hooks';

  const cols = ref(40);
  const rows = ref(5);

  const { width, height } = toRefs(
    reactive({
      width: 0,
      height: 0,
    }),
  );
  const valueRef = ref();

  const handleCols = () => {
    cols.value += 1;
  };
  const handleRows = () => {
    rows.value += 1;
  };

  const { isSupported, stop } = useResizeObserver([valueRef], (entries) => {
    const entry = entries[0];
    const { width: _w, height: _h } = entry.contentRect;
    width.value = _w;
    height.value = _h;
  });
</script>

<style>
  .resize {
    min-width: 200px;
    min-height: 200px;
    max-width: 500px;
    max-height: 500px;
  }
</style>
