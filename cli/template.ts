export const createUseHooksTemplate = (name) => `\
function ${name}() { 

}
export default ${name};
`;

// 创建 vueHooks 示例文档
export const createUseHooksDemo = (name) => `\
<template>
  <div>${name}</div>
</template>



<script setup>
import { ${name} } from 'zhongjiayao_v3_hooks'
</script>
`;

// 创建 md 文档
export const createUseHooksMd = (name, description) => `\
# ${name}
${description}

<preview path="./demo/index.vue" title="基本使用" description='${name}'></preview>
`;

// 创建 meta.json 模板
export const createMeta = (type) => `\
{
  "type": "${type}",
}
  `;
