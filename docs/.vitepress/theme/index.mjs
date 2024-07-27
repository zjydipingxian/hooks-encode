import DefaultTheme from 'vitepress/theme'
import { AntDesignContainer, ElementPlusContainer, NaiveUIContainer } from '@vitepress-demo-preview/component'
import '@vitepress-demo-preview/component/dist/style.css'


export default {
  ...DefaultTheme,
  enhanceApp({app}) {
    console.log("🚀 ~ enhanceApp ~ app:", app)
    app.component('demo-preview', AntDesignContainer)
  }
}