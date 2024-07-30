# useEventListener

方便地进行事件绑定，在组件 mounted 和 activated 时绑定事件，unmounted 和 deactivated 时解绑事件。

## 基本用法

<preview path="./demo/index.vue" title="基本使用"></preview>

## 取消事件监听

<preview path="./demo/cleanup.vue" title="基本使用"></preview>

## API

### 参数

| 参数     | 说明           | 类型            | 默认值 |
| -------- | -------------- | --------------- | ------ |
| type     | 监听的事件类型 | _string_        | -      |
| listener | 事件回调函数   | _EventListener_ | -      |
| options  | 可选的配置项   | _Options_       | -      |

### Options

| 参数    | 说明                                                            | 类型                               | 默认值   |
| ------- | --------------------------------------------------------------- | ---------------------------------- | -------- |
| target  | 绑定事件的元素                                                  | _EventTarget \| Ref\<EventTarget>_ | `window` |
| capture | 是否在事件捕获阶段触发                                          | _boolean_                          | `false`  |
| passive | 设置为 `true` 时，表示 `listener` 永远不会调用 `preventDefault` | _boolean_                          | `false`  |
