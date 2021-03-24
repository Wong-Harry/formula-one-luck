import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

// vuex
import store from './store'
Vue.prototype.$store = store

const app = new Vue({
    ...App
})
app.$mount()
