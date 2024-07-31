# useLocalStorage

一个可以将状态持久化存储在 localStorage 中的 Hook 。

<preview path="./demo/index.vue" title="将 state 存储在 localStorage 中" description='刷新页面后，可以看到输入框中的内容被从 localStorage 中恢复了'></preview>

## Api

### 参数

| 参数         | 说明                 | 类型    | 默认值 |
| :----------- | :------------------- | :------ | :----- |
| key          | LocalStorage存储键名 | any     | -      |
| initialValue | 初始值               | any     | {}     |
| options      | 配置                 | Options | -      |

### Options

| 参数  | 说明                     | 类型    | 默认值 |
| :---- | :----------------------- | :------ | :----- |
| watch | 是否实时修改LocalStorage | boolean | true   |

### 返回结果

| 参数  | 说明               | 类型 |
| :---- | :----------------- | :--- |
| state | 可以被修改的数据源 | any  |
