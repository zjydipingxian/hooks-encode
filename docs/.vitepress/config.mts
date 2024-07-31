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
      { text: '指南', link: '/guide' },
      { text: 'Hooks', link: '/useEventListener' }
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '介绍', link: '/guide' },
          { text: '安装', link: '/install' },
          { text: '快速上手', link: '/start' },
        ]
      },
      {
        items: [
          ...getRouterConfig(),
        ]
      },
      
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zjydipingxian/hooks-encode' }
    ]
  },
  

})
