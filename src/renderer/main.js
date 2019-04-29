import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faCoffee, faTimes, faWindowMaximize, faWindowMinimize, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCoffee, faTimes, faWindowMaximize, faWindowMinimize, faPlus, faMinus)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(BootstrapVue)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// 형제 컴포넌트 간 값 전달 방법 1
export const eventBus = new Vue()
// eventBus 가 여러개 생성될 경우 관리 하는 방법

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
