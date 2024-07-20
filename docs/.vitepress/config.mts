import { defineConfig } from 'vitepress'
console.log('dsdsds', process.cwd())

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ZhongJiaYao",
  description: "前端vue3 hooks 编码",
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
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },

})
