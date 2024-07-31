# useThrottle

用来处理节流值的 Hook。

## 基本使用

<preview path="./demo/index.vue" title="基本使用" description='ThrottledValue 每隔 500ms 变化一次。'></preview>

## Api

### 参数

| 参数  | 说明                 | 类型   | 默认值 |
| :---- | :------------------- | :----- | :----- |
| value | 需要节流的值         | any    | -      |
| wait  | 超时时间，单位为毫秒 | number | 1000   |
