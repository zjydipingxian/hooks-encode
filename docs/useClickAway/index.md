# useClickAway

监听目标元素外的点击事件。

## 基本用法

<preview path="./demo/index.vue" title="基本使用" description='请点击按钮或按钮外查看效果。'></preview>

## 多个 DOM

<preview path="./demo/custom-dom.vue"></preview>

## 监听其它事件

<preview path="./demo/custom-event.vue" description='触发鼠标右键， 即可查看效果'></preview>

## 注册多个事件

<preview path="./demo/custom-events.vue"  description='触发鼠标右键 / 点击鼠标 即可查看效果'></preview>

## API

### 参数

| 参数     | 说明                                       | 类型                                                           | 默认值 |
| -------- | ------------------------------------------ | -------------------------------------------------------------- | ------ |
| target   | 绑定事件的元素，支持传入数组来绑定多个元素 | _Element \| Ref\<Element> \| Array\<Element \| Ref\<Element>>_ | -      |
| listener | 点击外部时触发的回调函数                   | _EventListener_                                                | -      |
| options  | 可选的配置项                               | _Options_                                                      | 见下表 |

### Options

| 参数      | 说明           | 类型                                       | 默认值  |
| --------- | -------------- | ------------------------------------------ | ------- |
| eventName | 监听的事件类型 | `DocumentEventKey` \| `DocumentEventKey[]` | `click` |
