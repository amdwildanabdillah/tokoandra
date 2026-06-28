import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import {initTheme} from './theme'

initTheme()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
