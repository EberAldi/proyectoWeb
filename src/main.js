// ← que apunte al archivo correcto

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faUser,
  faGamepad,
  faLock,
  faEnvelope,
  faEye,
  faEyeSlash,
  faSignInAlt,
  faUserPlus,
  faBars,
  faTimes,
  faHome,
  faClock,
  faTag,
  faChartBar,
  faCog,
  faShoppingCart,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faUser,
  faGamepad,
  faLock,
  faEnvelope,
  faEye,
  faEyeSlash,
  faSignInAlt,
  faUserPlus,
  faBars,
  faTimes,
  faHome,
  faClock,
  faTag,
  faChartBar,
  faCog,
  faShoppingCart,
  faSignOutAlt,
  faEye,
  faEyeSlash,
  faSignOutAlt,
  faBars,
  faTimes,
  faShoppingCart,
  faCog,
  faTag,
  faChartBar,
)

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
