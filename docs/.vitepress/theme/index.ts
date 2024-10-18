// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { AntDesignContainer } from '@vitepress-demo-preview/component'
import { Button, Space, Input, Card } from 'ant-design-vue';
import '@vitepress-demo-preview/component/dist/style.css'
import './style.css'
import 'ant-design-vue/dist/reset.css';
import NullLayout from './NullLayout.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(NullLayout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app }) {
    // ...
    app.component('demo-preview', AntDesignContainer)
    app.use(Button).use(Space).use(Input).use(Card)
  }
} satisfies Theme
