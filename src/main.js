import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .use(ElementPlus, { size: 'mini', zIndex: 3000 })
  .mount('#app')
