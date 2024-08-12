# useVirtualList

长列表虚拟化列表的 Hook，用于解决展示海量数据渲染时首屏渲染缓慢和滚动卡顿问题。

<preview path="./demo/index.vue" title="基本使用" description='useVirtualList'></preview>

## Api

### Params

| 参数    | 说明                   | 类型    | 默认值 |
| :------ | :--------------------- | :------ | :----- |
| arr     | 包含大量数据的列表     | T[]     | []     |
| options | 可选配置项，见 Options | Options | -      |

### Options

| 参数       | 说明                                                   | 类型                               | 默认值 |
| :--------- | :----------------------------------------------------- | :--------------------------------- | :----- |
| itemHeight | 行高度，静态高度可以直接写入像素值，动态高度可传入函数 | number / (index: number) => number | -      |
| overscan   | 视区上、下额外展示的 dom 节点数量                      | number                             | 5      |

### Result

| 参数           | 说明                      | 类型                    |
| :------------- | :------------------------ | :---------------------- |
| list           | 当前需要展示的列表内容    | T[]                     |
| containerProps | 滚动容器的 props          | object                  |
| wrapperStyle   | children 外层包裹器 Style | object                  |
| scrollTo       | 快速滚动到指定 index      | (index: number) => void |
