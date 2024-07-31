# useDebounceFn

用来处理防抖函数的 Hook。

## 基础用法

<preview path="./demo/index.vue" title="基本使用" description='频繁调用 run，但只会在所有点击完成 500ms 后执行一次相关函数'></preview>

## Api

### 参数

| 参数 | 说明                 | 类型       | 默认值 |
| :--- | :------------------- | :--------- | :----- |
| fn   | 需要防抖执行的函数   | () => void | -      |
| wait | 超时时间，单位为毫秒 | number     | 1000   |
