import { createApp } from 'vue'
import Vue from 'vue'
// @ts-ignore
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios'

// console.log(process.env.NODE_ENV);
// console.log(process.env.VUE_APP_URL);
// console.log(process.env.BASE_URL)
// Object.defineProperty(createApp, '$axios', {
//   value: axios
// })

const app = createApp(App)

app.config.globalProperties.$http = axios

app.use(store).use(router).mount('#app')
