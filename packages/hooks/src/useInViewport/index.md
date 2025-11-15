# useInViewport

监听元素是否进入视口的 Hook，基于 `IntersectionObserver` API 实现，适用于图片懒加载、无限滚动、曝光埋点等场景。

## 基本用法

<preview path="./demo/index.vue" title="基本使用" description="演示基础用法、自定义阈值、提前触发、图片懒加载等场景"></preview>

## API

```typescript
const { inViewport, ratio } = useInViewport(
  target: BasicTarget,
  options?: UseInViewportOptions
): UseInViewportResult
```

## Params

| 参数    | 说明     | 类型                   | 默认值 |
| ------- | -------- | ---------------------- | ------ |
| target  | 目标元素 | `BasicTarget`          | -      |
| options | 配置选项 | `UseInViewportOptions` | -      |

## BasicTarget

支持以下几种类型：

| 类型                | 说明         | 示例                                   |
| ------------------- | ------------ | -------------------------------------- |
| `HTMLElement`       | DOM 元素     | `document.getElementById('box')`       |
| `Ref<HTMLElement>`  | Vue Ref      | `const boxRef = ref()`                 |
| `() => HTMLElement` | 函数返回元素 | `() => document.querySelector('.box')` |

## Options

| 参数       | 说明                                 | 类型                    | 默认值        |
| ---------- | ------------------------------------ | ----------------------- | ------------- |
| rootMargin | 根元素的外边距，可以提前或延迟触发   | `string`                | `'0px'`       |
| threshold  | 触发回调的阈值，0-1 之间的数字或数组 | `number` \| `number[]`  | `0`           |
| root       | 根元素，用作视口的元素               | `HTMLElement` \| `null` | `null` (视口) |

### rootMargin 说明

- 格式类似 CSS 的 margin：`'10px'`、`'10px 20px'`、`'10px 20px 30px 40px'`
- 支持负值，缩小检测范围：`'-100px'`
- 支持百分比：`'10%'`
- 常用场景：
  - `'100px'` - 提前 100px 触发（懒加载优化）
  - `'-50px'` - 元素需要完全进入视口再触发

### threshold 说明

- `0` - 只要有 1 像素进入视口就触发（默认）
- `0.5` - 元素 50% 进入视口时触发
- `1` - 元素 100% 进入视口时触发
- `[0, 0.25, 0.5, 0.75, 1]` - 每 25% 触发一次

## Result

| 参数       | 说明                             | 类型           |
| ---------- | -------------------------------- | -------------- |
| inViewport | 元素是否在视口内（响应式）       | `Ref<boolean>` |
| ratio      | 元素可见比率，0-1 之间（响应式） | `Ref<number>`  |

## 使用示例

### 基础用法

```vue
<template>
  <div ref="boxRef" :class="{ visible: inViewport }">
    <p>元素{{ inViewport ? '在' : '不在' }}视口内</p>
    <p>可见比率: {{ (ratio * 100).toFixed(0) }}%</p>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useInViewport } from 'zhongjiayao_v3_hooks';

  const boxRef = ref();
  const { inViewport, ratio } = useInViewport(boxRef);
</script>
```

### 图片懒加载

```vue
<template>
  <div ref="imageRef">
    <img v-if="inViewport" :src="imageSrc" alt="懒加载图片" />
    <div v-else class="placeholder">加载中...</div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useInViewport } from 'zhongjiayao_v3_hooks';

  const imageRef = ref();
  const imageSrc = 'https://example.com/image.jpg';

  // 提前 100px 开始加载图片
  const { inViewport } = useInViewport(imageRef, {
    rootMargin: '100px',
  });
</script>
```

### 自定义阈值（50% 可见时触发）

```vue
<script setup>
  import { ref } from 'vue';
  import { useInViewport } from 'zhongjiayao_v3_hooks';

  const boxRef = ref();
  const { inViewport, ratio } = useInViewport(boxRef, {
    threshold: 0.5, // 50% 可见时触发
  });
</script>
```

### 无限滚动列表

```vue
<template>
  <div class="list">
    <div v-for="item in list" :key="item.id">{{ item.name }}</div>
    <div ref="loadMoreRef" class="loading">
      {{ loading ? '加载中...' : '加载更多' }}
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import { useInViewport } from 'zhongjiayao_v3_hooks';

  const list = ref([]);
  const loading = ref(false);
  const loadMoreRef = ref();

  const { inViewport } = useInViewport(loadMoreRef, {
    rootMargin: '100px', // 提前 100px 触发
  });

  // 监听进入视口，自动加载更多
  watch(inViewport, (isInView) => {
    if (isInView && !loading.value) {
      loadMore();
    }
  });

  async function loadMore() {
    loading.value = true;
    // 加载数据...
    const newData = await fetchData();
    list.value.push(...newData);
    loading.value = false;
  }
</script>
```

### 埋点曝光

```vue
<script setup>
  import { ref, watch } from 'vue';
  import { useInViewport } from 'zhongjiayao_v3_hooks';

  const adRef = ref();
  const { inViewport } = useInViewport(adRef, {
    threshold: 0.5, // 50% 可见才算曝光
  });

  // 监听曝光
  watch(inViewport, (isInView) => {
    if (isInView) {
      // 发送埋点
      reportExposure('ad_banner_001');
    }
  });
</script>
```

### 指定根元素（容器内滚动）

```vue
<template>
  <div ref="containerRef" class="scroll-container">
    <div ref="itemRef">滚动项</div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useInViewport } from 'zhongjiayao_v3_hooks';

  const containerRef = ref();
  const itemRef = ref();

  // 在容器内滚动时检测
  const { inViewport } = useInViewport(itemRef, {
    root: containerRef.value, // 指定容器为根元素
  });
</script>
```

### 多个阈值监听

```vue
<script setup>
  import { ref, watch } from 'vue';
  import { useInViewport } from 'zhongjiayao_v3_hooks';

  const boxRef = ref();
  const { inViewport, ratio } = useInViewport(boxRef, {
    threshold: [0, 0.25, 0.5, 0.75, 1], // 每 25% 触发一次
  });

  // 监听可见比率变化
  watch(ratio, (newRatio) => {
    console.log(`元素可见 ${(newRatio * 100).toFixed(0)}%`);
  });
</script>
```

## 注意事项

1. **浏览器兼容性**
   - 基于 `IntersectionObserver` API
   - 现代浏览器均已支持
   - 不支持的浏览器会在控制台给出警告

2. **性能优化**
   - 使用 `IntersectionObserver` 性能优于传统的 scroll 监听
   - 自动在组件卸载时清理观察器

3. **动态元素**
   - 支持 Vue Ref，元素变化时自动重新观察
   - 适合动态渲染的场景

4. **阈值设置**
   - `threshold: 0` 适合懒加载（只要出现就加载）
   - `threshold: 0.5` 适合埋点（需要较大面积可见）
   - `threshold: 1` 适合动画触发（完全可见才播放）

## 应用场景

- ✅ **图片懒加载** - 提升首屏性能
- ✅ **无限滚动** - 滚动到底部自动加载
- ✅ **曝光埋点** - 统计广告/内容曝光
- ✅ **动画触发** - 元素进入视口播放动画
- ✅ **虚拟滚动** - 只渲染可见区域
- ✅ **懒加载组件** - 按需加载重组件
