import './assets/main.css'
import 'bootstrap'

import { createApp } from 'vue'
import { vMaska } from 'maska'
import router from './router'
import App from './App.vue'

createApp(App).use(router).directive('maska', vMaska).mount('#app')
