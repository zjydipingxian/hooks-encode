# usePagination

分页状态管理 Hook，提供完整的分页逻辑，包括页码切换、每页条数修改、总数管理等功能，适用于表格、列表等需要分页的场景。

## 代码演示

<preview path="./demo/basic.vue" title="基础分页" description="基本使用、自定义页码大小、快速跳转、分页状态等基础功能"></preview>

<preview path="./demo/table.vue" title="表格分页" description="基础表格分页、带搜索的表格分页、服务端分页等场景"></preview>

<preview path="./demo/list.vue" title="列表分页" description="卡片列表、文章列表、图片画廊、迷你分页等多种列表展示"></preview>

## API

```typescript
const {
  current,
  pageSize,
  total,
  totalPage,
  isFirstPage,
  isLastPage,
  changeCurrent,
  changePageSize,
  setTotal,
  prev,
  next,
  first,
  last,
  reset,
  getPaginationParams,
} = usePagination(options?: UsePaginationOptions)
```

## Options

| 参数            | 说明         | 类型       | 默认值              |
| --------------- | ------------ | ---------- | ------------------- |
| defaultCurrent  | 默认当前页   | `number`   | `1`                 |
| defaultPageSize | 默认每页条数 | `number`   | `10`                |
| pageSizeOptions | 每页条数选项 | `number[]` | `[10, 20, 50, 100]` |
| total           | 总条数       | `number`   | `0`                 |

## Result

| 参数                | 说明               | 类型                      |
| ------------------- | ------------------ | ------------------------- |
| current             | 当前页码（响应式） | `Ref<number>`             |
| pageSize            | 每页条数（响应式） | `Ref<number>`             |
| total               | 总条数（响应式）   | `Ref<number>`             |
| totalPage           | 总页数（计算属性） | `ComputedRef<number>`     |
| isFirstPage         | 是否是第一页       | `ComputedRef<boolean>`    |
| isLastPage          | 是否是最后一页     | `ComputedRef<boolean>`    |
| changeCurrent       | 跳转到指定页       | `(page: number) => void`  |
| changePageSize      | 修改每页条数       | `(size: number) => void`  |
| setTotal            | 设置总条数         | `(total: number) => void` |
| prev                | 上一页             | `() => void`              |
| next                | 下一页             | `() => void`              |
| first               | 跳转到第一页       | `() => void`              |
| last                | 跳转到最后一页     | `() => void`              |
| reset               | 重置分页           | `() => void`              |
| getPaginationParams | 获取分页参数       | `() => PaginationParams`  |

## 使用示例

### 基本使用

```vue
<template>
  <div>
    <a-space>
      <a-button :disabled="isFirstPage" @click="prev">上一页</a-button>
      <span>第 {{ current }} / {{ totalPage }} 页</span>
      <a-button :disabled="isLastPage" @click="next">下一页</a-button>
    </a-space>

    <a-pagination v-model:current="current" v-model:page-size="pageSize" :total="total" />
  </div>
</template>

<script setup>
  import { usePagination } from 'zhongjiayao_v3_hooks';

  const { current, pageSize, total, totalPage, isFirstPage, isLastPage, prev, next } = usePagination({
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 100,
  });
</script>
```

### 表格分页

```vue
<template>
  <a-table
    :columns="columns"
    :data-source="tableData"
    :pagination="{
      current,
      pageSize,
      total,
      showSizeChanger: true,
      showQuickJumper: true,
    }"
    @change="handleTableChange"
  />
</template>

<script setup>
  import { computed } from 'vue';
  import { usePagination } from 'zhongjiayao_v3_hooks';

  const { current, pageSize, total, changeCurrent, changePageSize } = usePagination({
    defaultPageSize: 10,
    total: 100,
  });

  // 根据分页参数计算当前页数据
  const tableData = computed(() => {
    const start = (current.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return allData.slice(start, end);
  });

  const handleTableChange = (pagination) => {
    changeCurrent(pagination.current);
    changePageSize(pagination.pageSize);
  };
</script>
```

### 服务端分页

```vue
<script setup>
  import { ref, watch } from 'vue';
  import { usePagination } from 'zhongjiayao_v3_hooks';

  const { current, pageSize, total, changeCurrent, changePageSize, setTotal } = usePagination({
    defaultPageSize: 10,
  });

  const loading = ref(false);
  const dataSource = ref([]);

  // 获取数据
  const fetchData = async () => {
    loading.value = true;

    const response = await api.getList({
      page: current.value,
      pageSize: pageSize.value,
    });

    dataSource.value = response.data;
    setTotal(response.total); // 更新总数

    loading.value = false;
  };

  // 监听分页变化，自动请求数据
  watch(
    [current, pageSize],
    () => {
      fetchData();
    },
    { immediate: true },
  );
</script>
```

### 自定义页码大小

```vue
<template>
  <div>
    <a-radio-group v-model:value="pageSize">
      <a-radio-button :value="10">10 条/页</a-radio-button>
      <a-radio-button :value="20">20 条/页</a-radio-button>
      <a-radio-button :value="50">50 条/页</a-radio-button>
    </a-radio-group>

    <a-pagination v-model:current="current" :page-size="pageSize" :total="total" />
  </div>
</template>

<script setup>
  import { usePagination } from 'zhongjiayao_v3_hooks';

  const { current, pageSize, total } = usePagination({
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
    total: 200,
  });
</script>
```

### 快速跳转

```vue
<template>
  <div>
    <a-space>
      <span>跳转到：</span>
      <a-input-number v-model:value="jumpPage" :min="1" :max="totalPage" />
      <a-button @click="handleJump">跳转</a-button>
    </a-space>

    <a-pagination v-model:current="current" :page-size="pageSize" :total="total" show-quick-jumper />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { usePagination } from 'zhongjiayao_v3_hooks';

  const { current, pageSize, total, totalPage, changeCurrent } = usePagination({
    defaultPageSize: 15,
    total: 150,
  });

  const jumpPage = ref(1);
  const handleJump = () => {
    changeCurrent(jumpPage.value);
  };
</script>
```

### 分页状态判断

```vue
<template>
  <div>
    <a-alert v-if="isFirstPage" message="当前是第一页" type="info" />
    <a-alert v-if="isLastPage" message="当前是最后一页" type="warning" />

    <div>
      当前范围: 第 {{ (current - 1) * pageSize + 1 }} - {{ Math.min(current * pageSize, total) }} 条， 共 {{ total }} 条数据
    </div>
  </div>
</template>

<script setup>
  import { usePagination } from 'zhongjiayao_v3_hooks';

  const { current, pageSize, total, isFirstPage, isLastPage } = usePagination({
    defaultPageSize: 20,
    total: 250,
  });
</script>
```

### 重置分页

```vue
<template>
  <div>
    <a-button @click="reset">重置分页</a-button>

    <a-pagination v-model:current="current" v-model:page-size="pageSize" :total="total" />
  </div>
</template>

<script setup>
  import { usePagination } from 'zhongjiayao_v3_hooks';

  const { current, pageSize, total, reset } = usePagination({
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 100,
  });

  // reset() 会将 current 和 pageSize 恢复到默认值
</script>
```

### 获取分页参数

```vue
<script setup>
  import { usePagination } from 'zhongjiayao_v3_hooks';

  const { getPaginationParams } = usePagination({
    defaultPageSize: 10,
    total: 100,
  });

  // 获取当前分页参数，用于发送请求
  const fetchData = async () => {
    const params = getPaginationParams();
    // params = { current: 1, pageSize: 10, total: 100 }

    const response = await api.getList(params);
  };
</script>
```

## 注意事项

1. **自动边界处理**
   - 页码超出范围时自动修正到有效范围
   - 修改 `pageSize` 时自动调整 `current` 确保不超出范围

2. **响应式状态**
   - `current`、`pageSize`、`total` 都是响应式 ref
   - 可以直接在模板中使用或通过 `.value` 访问

3. **计算属性**
   - `totalPage`、`isFirstPage`、`isLastPage` 是计算属性
   - 会自动根据其他状态变化而更新

4. **页码从 1 开始**
   - 页码计数从 1 开始（不是 0）
   - 符合常见的分页组件习惯

## 应用场景

- ✅ **表格分页** - 配合 Table 组件实现数据分页
- ✅ **列表分页** - 卡片列表、文章列表等
- ✅ **服务端分页** - 与后端 API 配合实现服务端分页
- ✅ **前端分页** - 本地数据的分页展示
- ✅ **搜索结果分页** - 搜索功能的结果分页
- ✅ **图片画廊** - 大量图片的分页展示
