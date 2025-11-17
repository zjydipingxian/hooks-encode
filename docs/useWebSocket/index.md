# useWebSocket

用于处理 WebSocket 连接的 Hook，提供自动重连、消息管理等功能。

## 基本使用

<preview path="./demo/index.vue" title="基本使用" description='建立 WebSocket 连接并收发消息'></preview>

## API

```typescript
const { socket, sendMessage, disconnect, connect, reconnect, connected } = useWebSocket(socketUrl, options);
```

## 参数

| 参数      | 说明                 | 类型                  | 默认值 |
| --------- | -------------------- | --------------------- | ------ |
| socketUrl | WebSocket 服务器地址 | `string`              | -      |
| options   | 配置选项             | `UseWebSocketOptions` | -      |

## Options

| 参数              | 说明                 | 类型                            | 默认值     |
| ----------------- | -------------------- | ------------------------------- | ---------- |
| manual            | 是否手动触发连接     | `boolean`                       | `false`    |
| reconnectLimit    | 最大重连次数         | `number`                        | `3`        |
| reconnectInterval | 重连延迟时间（毫秒） | `number`                        | `3000`     |
| heartbeatInterval | 心跳间隔时间（毫秒） | `number`                        | `3000`     |
| heartbeat         | 是否启用心跳检测     | `boolean`                       | `true`     |
| heartbeatMessage  | 心跳消息内容         | `string`                        | `ping`     |
| onOpen            | 连接建立时的回调函数 | `(event: Event) => void`        | -          |
| onClose           | 连接关闭时的回调函数 | `(event: CloseEvent) => void`   | `() => {}` |
| onMessage         | 接收消息时的回调函数 | `(event: MessageEvent) => void` | -          |
| onError           | 发生错误时的回调函数 | `(event: Event) => void`        |

## 返回结果

| 参数          | 说明             | 类型                                                                   |
| ------------- | ---------------- | ---------------------------------------------------------------------- |
| socket        | WebSocket 实例   | null`                                                                  |
| sendMessage   | 发送消息的函数   | `(data: string \| ArrayBufferLike \| Blob \| ArrayBufferView) => void` |
| disconnect    | 断开连接的函数   | `() => void`                                                           |
| connect       | 手动建立连接方法 | `() => void`                                                           |
| latestMessage | 最新消息         | `Ref<string>`                                                          |
| readyState    | 连接状态         | `Ref<number>`                                                          |
