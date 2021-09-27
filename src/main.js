import {
  createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

createApp(App).use(store).use(router).mount('#app')
