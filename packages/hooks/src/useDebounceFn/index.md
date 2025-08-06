# useDebounceFn

用来处理防抖函数的 Hook。

## 基础用法

<preview path="./demo/index.vue" title="基本使用" description='频繁调用 run，但只会在所有点击完成 500ms 后执行一次相关函数'></preview>

## 修改默认时间

<preview path="./demo/updateTime.vue" title="修改默认时间" description='修改默认时间为 3000ms 后只会在所有点击完成 3000ms 后执行一次相关函数'></preview>

## 取消

<preview path="./demo/cancel.vue" title="取消" description='取消当前防抖'></preview>

## Api

### 参数

| 参数 | 说明                 | 类型       | 默认值 |
| :--- | :------------------- | :--------- | :----- |
| fn   | 需要防抖执行的函数   | () => void | -      |
| wait | 超时时间，单位为毫秒 | number     | 1000   |

## Result

| 参数   | 说明                               | 类型                      |
| ------ | ---------------------------------- | ------------------------- |
| run    | 触发执行 fn，函数参数将会传递给 fn | `(...args: any[]) => any` |
| cancel | 取消当前防抖                       | `() => void`              |
| flush  | 立即调用当前防抖函数               | `() => void`              |
