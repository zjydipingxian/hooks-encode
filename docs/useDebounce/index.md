# useDebounce

用来处理防抖值的 Hook。

## 基础用法

<preview path="./demo/index.vue" title="基本使用" description='DebouncedValue 只会在输入结束 500ms 后变化。'></preview>

## Api

### 参数

| 参数  | 说明                 | 类型   | 默认值 |
| :---- | :------------------- | :----- | :----- |
| value | 需要防抖的值         | any    | -      |
| wait  | 超时时间，单位为毫秒 | number | 1000   |
