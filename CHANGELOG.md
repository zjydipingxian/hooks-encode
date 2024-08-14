# 1.0.0 (2024-08-14)


* 移除文档中未使用的插件和示例，并注释掉Router配置中的弃用功能 ([b17534b](https://github.com/zjydipingxian/hooks-encode/commit/b17534b62da08a54ffe733aafdaae88e7edea2da))


### Bug Fixes

* **husky:** 从pre-push脚本中移除不必要的git push ([3939ac7](https://github.com/zjydipingxian/hooks-encode/commit/3939ac745787327681fde31a4fdaf393cd7cc48b))
* **husky:** 修复pre-push脚本换行符问题并更新changelog ([5693021](https://github.com/zjydipingxian/hooks-encode/commit/56930211dd71dccc5e19ba7eb2f5fab50cc1d5c6))
* **husky:** 修复pre-push脚本中换行符问题 ([c04501e](https://github.com/zjydipingxian/hooks-encode/commit/c04501e60778585426a170c7cd1002b56f32fbe3))
* **husky:** 移除pre-push钩子中的自动推送 ([8026db4](https://github.com/zjydipingxian/hooks-encode/commit/8026db4b9336fae1e32ca10200996d9242503f04))


### Features

* 发布`zhongjiayao_v3_hooks`的`1.0.0`版本，设置访问级别为public并更新内部依赖性。移除直接发布命令，使用changeset进行发布 ([6ed8ddf](https://github.com/zjydipingxian/hooks-encode/commit/6ed8ddf17fac46ae1a96bf71ca15b14f9b41189c))
* 优化代码结构并增强功能 ([1f988d0](https://github.com/zjydipingxian/hooks-encode/commit/1f988d0134a17b52d07bfd3468526c795074b39b))
* 重命名watch.js为cli/watch.mjs并更新相关引用 ([900b9fe](https://github.com/zjydipingxian/hooks-encode/commit/900b9fe3f3539fd92b8fc2d061ef649d7d8767cf))
* **cli:** 创建hooks时增加分类和元数据支持 ([354efbb](https://github.com/zjydipingxian/hooks-encode/commit/354efbbf4ffbfd158b3dc243c5041826a01c0512))
* **cli:** 自动化文档生成和部署流程优化 ([eae7282](https://github.com/zjydipingxian/hooks-encode/commit/eae7282fb7ef417791d985decfb7efa1b1999da6))
* **docs:** 添加文档生成和路由配置 ([8545084](https://github.com/zjydipingxian/hooks-encode/commit/85450846c2dc5de3e1827d28c0cf72733b95a289))
* **docs:** 重构部署脚本和更新文档配置 ([2e8f613](https://github.com/zjydipingxian/hooks-encode/commit/2e8f613853be2d7e8a00661131df94d05947c47c))
* **docs:** docs生成器更新 & meta.json类型修改 ([eb25ad3](https://github.com/zjydipingxian/hooks-encode/commit/eb25ad39cdee9a9444aec92cac11a539946219ac))
* **hooks:** "新增useDocumentVisibility钩子以检测页面可见性" ([970adda](https://github.com/zjydipingxian/hooks-encode/commit/970adda308a0759c24c379b9459e206873e91c0f))
* **hooks:** 添加 useResizeObserver 钩子以监听元素尺寸变化 ([9d71b99](https://github.com/zjydipingxian/hooks-encode/commit/9d71b99aaa172ee5d0583d4023865e599c24263c))
* **hooks:** 添加 useWindowSize 钩子并更新相关路由 ([1166b6b](https://github.com/zjydipingxian/hooks-encode/commit/1166b6b286999584f1521ac11ec0f20226604e8a))
* **hooks:** hooks包版本更新至0.0.8 ([7f1ccc7](https://github.com/zjydipingxian/hooks-encode/commit/7f1ccc7f4a69872d13526c2bf1abc31c87f3299f))
* **husky:** 提交钩子中的 changelog 生成命令 ([0950815](https://github.com/zjydipingxian/hooks-encode/commit/0950815f74f79c26386edc1fdc3f7d1005d607f7))
* **husky:** 添加更新changelog的预提交和预推送钩子 ([7e50f4d](https://github.com/zjydipingxian/hooks-encode/commit/7e50f4d5e96abe44cba606c8378f8f4be721b439))
* **husky:** 添加changelog生成和预提交钩子 ([100fa9e](https://github.com/zjydipingxian/hooks-encode/commit/100fa9e1b83d30fece5de7be319c1d8cb276fd72))
* **readme:** 添加项目特性、安装及使用说明 ([33e569d](https://github.com/zjydipingxian/hooks-encode/commit/33e569da0b7cd622688d5d291107f5079ff3c059))
* **repo:** 初始化changeset系统以支持多包版本管理和发布" ([75ece67](https://github.com/zjydipingxian/hooks-encode/commit/75ece6709949760a0b11b5be1857330d9f891ccb))
* **useDebounce:** 添加useDebounce钩子及其文档和演示 ([84a0de4](https://github.com/zjydipingxian/hooks-encode/commit/84a0de4a6c0bc6c92ba77a89827c5c71ec1ef907))
* **useFullscreen:** 添加全屏 hooks 支持 ([8d7b4c6](https://github.com/zjydipingxian/hooks-encode/commit/8d7b4c68660eb577380b46a02ab09b53b172b0a4))
* **useLocalStorage:** 添加useLocalStorage钩子并完善文档 ([99af3f7](https://github.com/zjydipingxian/hooks-encode/commit/99af3f7a67eb94adea2fe7ad88766dcd3062776f))
* **UseRequestFetch:** 新增 useElementBounding Hook 以动态获取 DOM 元素的尺寸和坐标 ([66321e4](https://github.com/zjydipingxian/hooks-encode/commit/66321e43d6f3b1cac242df99d5467a9918820608))
* **useThrottle:** 添加节流功能的Hook及文档 ([00de81a](https://github.com/zjydipingxian/hooks-encode/commit/00de81a15af00ff76c01367be9603b148d18ea42))
* **useTitle:** 添加 useTitle 钩子并进行文档更新 ([199f50e](https://github.com/zjydipingxian/hooks-encode/commit/199f50ea98ac4e23a54f35d6b54df53228888738))
* **useVirtualList:** 添加虚拟列表钩子以处理大型数据集 ([7292b7c](https://github.com/zjydipingxian/hooks-encode/commit/7292b7c9816ccf6aaa140ce662b281434d3ec0f0))
* **zhongjiayao_v3_hooks:** 新增 useOnline Hook 以检查浏览器在线状态 ([37af4bc](https://github.com/zjydipingxian/hooks-encode/commit/37af4bc092affa0336b084c7bac8bfdbb07c5ae1))


### BREAKING CHANGES

* 一些插件和功能被注释掉，并从文档中移除，这可能导致旧代码引用这些插件时出现问题。开发者应检查自己的代码base，确保没有使用到这些已被弃用的插件和功能。



