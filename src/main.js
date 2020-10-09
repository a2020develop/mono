import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAnime from 'vue-animejs'
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify'
import { rtdbPlugin } from 'vuefire'

Vue.use(VueAnime)
Vue.use({VueAxios, axios})
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(rtdbPlugin)

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
