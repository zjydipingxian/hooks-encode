# useRect

获取元素的大小及其相对于视口的位置，等价于
[Element.getBoundingClientRect](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)。

## 基本用法

<preview path="./demo/index.vue" title="基本使用" ></preview>

## API

### 类型定义

```ts
function useRect(element: Element | Window | Ref<Element | Window | undefined>): DOMRect;
```

### 返回值

| 参数   | 说明                       | 类型     |
| ------ | -------------------------- | -------- |
| width  | 宽度                       | _number_ |
| height | 高度                       | _number_ |
| top    | 顶部与视图窗口左上角的距离 | _number_ |
| left   | 左侧与视图窗口左上角的距离 | _number_ |
| right  | 右侧与视图窗口左上角的距离 | _number_ |
| bottom | 底部与视图窗口左上角的距离 | _number_ |
