# useFormatResult

格式化数据的 hook。

<preview path="./demo/index.vue" title="基本使用" description='格式化数据'></preview>

## API

```typescript
const formatData = useFormatResult(data, callback);
```

## Argument

| 参数     | 说明             | 类型                        | 默认值 |
| -------- | ---------------- | --------------------------- | ------ |
| data     | 需要格式化的数据 | `T` \| `Ref<T>`             | -      |
| callback | 格式化函数       | `(data: T) => FormatResult` | -      |

## Result

| 参数       | 说明           | 类型                                          |
| ---------- | -------------- | --------------------------------------------- |
| formatData | 格式化后的数据 | `ComputedRef<FormatResult>` \| `FormatResult` |
