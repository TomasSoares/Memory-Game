import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'
import router from './router'

import ErrorMessage from './components/common/ErrorMessage.vue'

import { io } from "socket.io-client"

const app = createApp(App)

app.use(createPinia())
app.use(router)

const apiDomain = import.meta.env.VITE_API_DOMAIN
const wsConnection = import.meta.env.VITE_WS_CONNECTION

// Default Axios configuration
axios.defaults.baseURL = `http://${apiDomain}/api`

app.component('ErrorMessage', ErrorMessage)

app.provide('socket', io(wsConnection))

app.provide('serverBaseUrl', apiDomain)

app.mount('#app')

