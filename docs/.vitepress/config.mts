import { defineConfig } from 'vitepress'
import path from 'path'
import { getRouterConfig } from './router.mjs'
import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'



// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ZhongJiaYao",
  description: "前端vue3 hooks 编码",
  base: '/hooks-encode/',
  vite: {
    resolve: {
      alias: {
        "zhongjiayao_v3_hooks": path.resolve(__dirname, '../../packages/hooks/src/index.ts')
      }
    },
  },
  markdown: {
    config: (md) => {
      md.use(containerPreview)
      md.use(componentPreview)
    }
  },
 
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples/' },
          { text: 'Runtime API Examples', link: '/api-examples/' },
          ...getRouterConfig()
        ]
      },
      
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  
})
