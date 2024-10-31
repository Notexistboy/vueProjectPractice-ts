import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import axios from 'axios'
import create from './utils/create'

import router from './router/index'
// import router from './krouter'

import store from './store/index'
// import store from './kstore'
import './test-ts'
Vue.config.productionTip = false
// 事件总线
Vue.prototype.$bus = new Vue()
Vue.prototype.$axios = axios
Vue.use(create)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
