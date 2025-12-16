# useCountUp

数字滚动动画 Hook，常用于数据大屏、统计展示等场景。

## 基本用法

<preview path="./demo/index.vue" title="基本用法"></preview>

## 动态更新

<preview path="./demo/update.vue" title="动态更新目标值"></preview>

## API

### 参数

```ts
useCountUp(endValue: number | Ref<number>, options?: UseCountUpOptions)
```

### UseCountUpOptions

| 参数      | 说明           | 类型                                           | 默认值      |
| --------- | -------------- | ---------------------------------------------- | ----------- |
| startValue | 起始值         | _number_                                       | `0`         |
| duration  | 动画时长（毫秒） | _number_                                       | `2000`      |
| autoplay  | 是否自动开始   | _boolean_                                      | `true`      |
| easing    | 缓动函数       | _'linear' \| 'easeOut' \| 'easeInOut' \| 'easeOutExpo' \| EasingFunction_ | `'easeOut'` |
| decimals  | 小数位数       | _number_                                       | `0`         |
| separator | 千分位分隔符   | _string_                                       | `','`       |
| decimal   | 小数点符号     | _string_                                       | `'.'`       |
| prefix    | 前缀           | _string_                                       | `''`        |
| suffix    | 后缀           | _string_                                       | `''`        |
| onFinish  | 动画完成回调   | _() => void_                                   | -           |
| onUpdate  | 动画更新回调   | _(value: number, formatted: string) => void_  | -           |

### 返回值

| 参数         | 说明                   | 类型                          |
| ------------ | ---------------------- | ----------------------------- |
| current      | 当前格式化后的显示值   | _ComputedRef\<string\>_       |
| currentValue | 当前原始数值           | _Ref\<number\>_               |
| isAnimating  | 是否正在动画中         | _Ref\<boolean\>_              |
| isFinished   | 动画是否已完成         | _Ref\<boolean\>_              |
| start        | 开始动画               | _(endValue?: number) => void_ |
| pause        | 暂停动画               | _() => void_                  |
| resume       | 恢复动画               | _() => void_                  |
| reset        | 重置动画               | _() => void_                  |
| update       | 更新目标值并继续动画   | _(newEndValue: number) => void_ |

### 缓动函数

| 名称       | 说明                         |
| ---------- | ---------------------------- |
| linear     | 线性，匀速运动               |
| easeOut    | 缓出，开始快结束慢（推荐）   |
| easeInOut  | 缓入缓出，中间快两端慢       |
| easeOutExpo | 指数缓出，更强的缓出效果    |
