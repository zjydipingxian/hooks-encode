# useCountDown

提供倒计时管理能力。

## 基本用法

<preview path="./demo/index.vue" title="基本使用" ></preview>

## 毫秒级渲染

<preview path="./demo/millisecond.vue" title="毫秒级渲染" ></preview>

## 开始 / 暂停

<preview path="./demo/index2.vue" title="开始 / 暂停" ></preview>

## API

### CurrentTime 格式

| 名称         | 说明                   | 类型     |
| ------------ | ---------------------- | -------- |
| total        | 剩余总时间（单位毫秒） | _number_ |
| days         | 剩余天数               | _number_ |
| hours        | 剩余小时               | _number_ |
| minutes      | 剩余分钟               | _number_ |
| seconds      | 剩余秒数               | _number_ |
| milliseconds | 剩余毫秒               | _number_ |

### 参数

| 参数        | 说明                       | 类型                             | 默认值  |
| ----------- | -------------------------- | -------------------------------- | ------- |
| time        | 倒计时时长，单位毫秒       | _number_                         | -       |
| millisecond | 是否开启毫秒级渲染         | _boolean_                        | `false` |
| onChange    | 倒计时改变时触发的回调函数 | _(current: CurrentTime) => void_ | -       |
| onFinish    | 倒计时结束时触发的回调函数 | _() => void_                     | -       |

### 返回值

| 参数    | 说明                               | 类型                    |
| ------- | ---------------------------------- | ----------------------- |
| current | 当前剩余的时间                     | _CurrentTime_           |
| start   | 开始倒计时                         | _() => void_            |
| pause   | 暂停倒计时                         | _() => void_            |
| reset   | 重置倒计时，支持传入新的倒计时时长 | _(time?: number): void_ |
