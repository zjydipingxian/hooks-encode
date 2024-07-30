import { defineConfig } from 'vitepress'
import path from 'path'
import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'
import { getRouterConfig } from './router.mjs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ZhongJiaYao",

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

  description: "Web Vue3 Hooks Code",
  base:"/hooks-encode/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          ...getRouterConfig(),
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  

})
