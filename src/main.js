import './assets/base.css'
import './assets/main.css'
import 'nprogress/nprogress.css'

// import fonction:
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// import plugins:
import App from './App.vue'
import router from './router'
import VeevalidatePlugin from './includes/validation'
import { auth } from './includes/firebase'
import Icon from './directives/icon' // directive personnalisée
import i18n from './includes/i18n'
// import { registerSW } from 'virtual:pwa-register'
import GlobalComponents from './includes/_globals'
import progressBar from './includes/progress-bar'

// registerSW({ immediate: true })

progressBar(router)

let app

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)

    // record plugins: La fonction use() lance la méthode "install" des plugins.
    app.use(createPinia())
    app.use(router)
    app.use(VeevalidatePlugin)
    app.use(i18n)
    app.use(GlobalComponents)
    app.directive('icon', Icon)

    app.mount('#app')
  }
})
