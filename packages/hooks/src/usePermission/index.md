# usePermission

权限 API 提供一致的编程方式来查询归因于当前上下文的 API 权限的状态。例如，权限 API 可用于确定是否已授予或拒绝访问特定 API 的权限，
或者是否需要特定的用户权限。参考 [Permissions_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Permissions_API)

## Demo1

<preview path="./demo/index.vue" title="基本使用" description='麦克风权限'></preview>

## Demo2

<preview path="./demo/controls.vue" title="基本使用" description='麦克风权限'></preview>

## API

| 参数    | 说明         | 类型               | 默认值 |
| ------- | ------------ | ------------------ | ------ |
| name    | 权限名称     | `PermissionName`   | -      |
| options | 额外的配置项 | `controls:boolean` | false  |

name 要查询权限的 API 名称。每个浏览器支持不同的值集。Firefox 的值
在[这里](https://searchfox.org/mozilla-central/source/dom/webidl/Permissions.webidl#10)，Chromium 的值
在[这里](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/modules/permissions/permission_descriptor.idl)，WebKit
的值在[这里](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/permissions/PermissionName.idl)。

## 返回值

```ts
export interface UsePermissionReturnWithControls {
  state: UsePermissionReturn;
  isSupported: Ref<boolean>;
  query: () => Promise<PermissionStatus | undefined>;
}
```
