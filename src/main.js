import Vue from 'vue'
import store from './store'
import App from './App'
import './uni.promisify.adaptor'
import uView from "uview-ui";
import Tabbar from "@/components/tabbar/index.vue";
Vue.use(uView);
Vue.component('Tabbar', Tabbar);
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
