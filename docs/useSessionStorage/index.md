# useSessionStorage

将状态存储在 sessionStorage 中的 Hook

<preview path="./demo/index.vue" title="基本使用" description='用法和useLocalStorage一致'></preview>

## Api

### 参数

| 参数         | 说明                   | 类型    | 默认值 |
| :----------- | :--------------------- | :------ | :----- |
| key          | sessionStorage存储键名 | any     | -      |
| initialValue | 初始值                 | any     | {}     |
| options      | 配置                   | Options | -      |

### Options

| 参数  | 说明                       | 类型    | 默认值 |
| :---- | :------------------------- | :------ | :----- |
| watch | 是否实时修改sessionStorage | boolean | true   |

### 返回结果

| 参数  | 说明               | 类型 |
| :---- | :----------------- | :--- |
| state | 可以被修改的数据源 | any  |
