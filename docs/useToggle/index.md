# useToggle

用于在多个状态值间切换的 Hook。

## 使用

<preview path="./demo/index.vue" title="基本使用" ></preview>

## 异步值Toggle

<preview path="./demo/async.vue" title="基本使用" ></preview>

useToggle可以接受ref值的切换，内部支持了响应式，如果ref值发生变化,state会监听其变化同步修改。

## Api

### Params

| 参数  | 说明         | 类型                                  | 默认值 |
| :---- | :----------- | :------------------------------------ | :----- |
| value | 需要切换的值 | string - number - boolean - undefined | -      |
| ...   | 同上         | 同上                                  | -      |

### Result

| 参数    | 说明     | 类型    |
| :------ | :------- | :------ |
| state   | 状态值   | -       |
| actions | 操作集合 | Actions |

### Actions

| 参数   | 说明                                           | 类型                  |
| :----- | :--------------------------------------------- | :-------------------- |
| toggle | 触发状态更改的函数，可以接受可选参数修改状态值 | (state?: any) => void |
| action | 按照value顺序设置state为vulue                  | () => void            |
| ...    | 同上                                           | 同上                  |
