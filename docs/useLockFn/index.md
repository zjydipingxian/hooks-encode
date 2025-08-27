# useLockFn

给异步函数加竞争锁的 Hook

<preview path="./demo/index.vue" title="基本使用" description='在 submit 函数执行完成前，其余的点击动作都会被忽略。场景：对于表单提交可以限制其多次提交'></preview>

## API

```typescript
function useLockFn<T extends unknown[], V>(fn: (...args: T) => Promise<V>): (...args: T) => Promise<V | undefined>;
```

## Result

| 参数 | 说明               | 类型                               |
| ---- | ------------------ | ---------------------------------- |
| fn   | 增加了竞态锁的函数 | `(...args: any[]) => Promise<any>` |

## Params

| 参数 | 说明                 | 类型                               | 默认值 |
| ---- | -------------------- | ---------------------------------- | ------ |
| fn   | 需要增加竞态锁的函数 | `(...args: any[]) => Promise<any>` | -      |
