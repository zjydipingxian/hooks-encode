# useMounted

<preview path="./demo/index.vue" title="基本使用" description='useMounted'></preview>

这实质上是以下内容的简写：

```ts
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});
```
