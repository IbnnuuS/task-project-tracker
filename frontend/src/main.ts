// import './assets/main.css' // Removed to fix missing asset error

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './routes'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize auth state
const authStore = useAuthStore()

// We try to fetch the user if we have a token on load
if (authStore.token) {
    authStore.fetchUser().catch(() => {
        // If it fails (invalid token), the store handles the logout natively
    }).finally(() => {
        app.mount('#app')
    })
} else {
    app.mount('#app')
}
