# useWinResize

监听 Windows 尺寸变化的 Hook

<preview path="./demo/index.vue" title="基本使用" description='监听windows尺寸, 会在尺寸变化时调用处理函数'></preview>

## API

```typescript
useWinResize(
  handler: (ev: Event) => void,
);
```

## Params

| 参数    | 说明     | 类型                  | 默认值 |
| ------- | -------- | --------------------- | ------ |
| handler | 处理函数 | `(ev: Event) => void` | -      |
