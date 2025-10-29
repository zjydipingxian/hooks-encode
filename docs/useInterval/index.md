# useInterval

处理 setInterval 的 Hook。

<preview path="./demo/index.vue" title="基本使用" description='每2000ms，执行一次'></preview>

## API

```javascript
useInterval(
  fn: () => void,
  delay?: number | undefined,
  options?: Options
): fn: () => void;
```

## Params

| 参数    | 说明                                        | 类型                                   |
| ------- | ------------------------------------------- | -------------------------------------- |
| fn      | 要定时调用的函数                            | `() => void`                           |
| delay   | 间隔时间，当取值 `undefined` 时会停止计时器 | `Ref<number>`\|`number` \| `undefined` |
| options | 配置计时器的行为                            | `Options`                              |

## Options

| 参数      | 说明                     | 类型      | 默认值  |
| --------- | ------------------------ | --------- | ------- |
| immediate | 是否在首次渲染时立即执行 | `boolean` | `false` |

## Result

| 参数    | 说明           | 类型         |
| ------- | -------------- | ------------ |
| clear   | 清除定时器     | `() => void` |
| restart | 重新启动定时器 | `() => void` |
