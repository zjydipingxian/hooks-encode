# useClipboard

提供剪贴板命令(剪切、复制和粘贴)

<preview path="./demo/index.vue" title="基本使用" description='输入值，请点击按钮查看效果'></preview>

## API

| 参数  | 说明       | 类型                   | 默认值 |
| ----- | ---------- | ---------------------- | ------ |
| value | 剪贴板内容 | `Ref<string> / string` | `''`   |

## 返回值

| 参数              | 说明           | 类型          |
| ----------------- | -------------- | ------------- |
| clipboardContent  | 复制文本的内容 | `Ref<string>` |
| copyToClipboard   | 复制文本方法   | `() => void`  |
| readFromClipboard | 从剪贴板读取   | `() => void`  |
