import { defineConfig } from 'vitepress'
import path from 'path'
import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'
import { getRouterConfig } from './router.mjs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ZhongJiaYao",

  head: [
    [
      'script',
      {
        charset: 'UTF-8',
        id: 'LA_COLLECT',
        src: '//sdk.51.la/js-sdk-pro.min.js',
      },
    ],
    [
      'script',
      {},
      `LA.init({id:"3Jx6Kflqb6AXQY85",ck:"3Jx6Kflqb6AXQY85",autoTrack:true,hashMode:true})`,
    ],
  ],
  
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
    search: {
      provider: 'local'
    },
    lastUpdated: {
      text: '最近更新',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    logo: '/logo.svg',
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
          // { text: '快速上手', link: '/start' },
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
