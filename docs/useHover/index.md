# useHover

监听 DOM 元素是否有鼠标悬停。

## 基础用法

<preview path="./demo/index.vue" title="基本使用" description='使用 ref 设置需要监听的元素。'></preview>

## API

### 参数

| 参数    | 说明                  | 类型                                                        | 默认值 |
| ------- | --------------------- | ----------------------------------------------------------- | ------ |
| target  | DOM 节点或者 Ref 对象 | `() => Element` \| `Element` \| `MutableRefObject<Element>` | -      |
| options | 额外的配置项          | `Options`                                                   | -      |

### Options

| 参数     | 说明                 | 类型                            | 默认值 |
| -------- | -------------------- | ------------------------------- | ------ |
| onEnter  | hover 时触发         | `() => void`                    | -      |
| onLeave  | 取消 hover 时触发    | `() => void`                    | -      |
| onChange | hover 状态变化时触发 | `(isHovering: boolean) => void` | -      |

### 返回结果

| 参数       | 说明                   | 类型      |
| ---------- | ---------------------- | --------- |
| isHovering | 鼠标元素是否处于 hover | `boolean` |
