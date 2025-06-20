//import './assets/main.css'
import './style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './font.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
