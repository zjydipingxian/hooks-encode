# useDocumentVisibility

监听页面是否可见，参考 [visibilityState API](https://developer.mozilla.org/docs/Web/API/Document/visibilityState)

<preview path="./demo/index.vue" title="基本使用" description='监听 document 的可见状态'></preview>

### Result

| 参数               | 说明                           | 类型                                               |
| ------------------ | ------------------------------ | -------------------------------------------------- |
| documentVisibility | 判断 document 是否处于可见状态 | `visible`\| `hidden` \| `prerender` \| `undefined` |
