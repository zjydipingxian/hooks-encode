# useResizeObserver

监听元素尺寸的变化。参考 [ResizeObserver API](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver)

<preview path="./demo/index.vue" title="基本使用" description='使用 ref 设置需要监听的元素。'></preview>

## API

```typescript
useResizeObserver(target, callback, {
  box: ResizeObserverBoxOptions,
});
```

## Params

| 参数    | 说明                  | 类型                                          | 默认值 |
| ------- | --------------------- | --------------------------------------------- | ------ |
| target  | DOM 节点或者 Ref 对象 | `() => Element` \| `Element` \| `JSX.Element` | -      |
| options | 额外的配置项          | `UseResizeObserverOptions`                    | -      |

## Options

| 参数 | 说明       | 类型                       | 默认值      |
| ---- | ---------- | -------------------------- | ----------- |
| box  | 盒模型模式 | `ResizeObserverBoxOptions` | content-box |
