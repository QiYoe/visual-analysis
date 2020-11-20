import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
console.log(process.env.BASE_URL)
createApp(App).use(store).use(router).mount('#app')
