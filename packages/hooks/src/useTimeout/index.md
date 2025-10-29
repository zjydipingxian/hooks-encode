# useTimeout

处理 setTimeout 的 Hook。

<preview path="./demo/index.vue" title="基本使用" description='3秒后开始执行'></preview>

## API

```javascript
useTimeout(
  fn: () => void,
  delay?: Ref<number | undefined> | number | undefined,
  options?:{
    immediate?: boolean
  }
): fn: () => void;
```

## Params

| 参数      | 说明                                                                       | 类型                                                   |
| --------- | -------------------------------------------------------------------------- | ------------------------------------------------------ |
| fn        | 待执行函数                                                                 | `() => void`                                           |
| delay     | 定时时间（单位为毫秒）,支持动态变化，，当取值为 `undefined` 时会停止计时器 | `Ref<number` \| `undefined >`\|`number` \| `undefined` |
| immediate | 是否在首次立即执行                                                         | `boolean`                                              |

## Result

| 参数         | 说明       | 类型         |
| ------------ | ---------- | ------------ |
| clearTimeout | 清除定时器 | `() => void` |
