# useSize

监听 DOM 节点尺寸变化的 Hook

<preview path="./demo/index.vue" title="基本使用" description='传入需要监听的ref'></preview>

传入 Dom

<preview path="./demo/index1.vue" title="基本使用" description='传入 body dom'></preview>

## API

```typescript
const size = useSize(target);
```

## Params

| 参数   | 说明             | 类型                                            | 默认值 |
| ------ | ---------------- | ----------------------------------------------- | ------ |
| target | DOM 节点或者 ref | `Element` \| `(() => Element)` \| `JSX.Element` | -      |

## Result

| 参数 | 说明           | 类型                                                            |
| ---- | -------------- | --------------------------------------------------------------- |
| size | DOM 节点的尺寸 | `Readonly<Ref<{ width: number, height: number } \| undefined>>` |
