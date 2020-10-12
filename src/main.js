import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAnime from 'vue-animejs'
import VueRouter from 'vue-router'
import VuePageTransition from 'vue-page-transition'
import VueCarousel from 'vue-carousel'
import vuetify from './plugins/vuetify'
import { rtdbPlugin } from 'vuefire'

Vue.use(VueAnime)
Vue.use({VueAxios, axios})
Vue.use(VuePageTransition)
Vue.use(VueCarousel)
Vue.use(rtdbPlugin)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.config.productionTip = false

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/start' },
    { path: '/start', component: () => import('./views/Start') },
    { path: '/create', component: () => import('./views/NewGame') },
    { path: '/create/invite-players', component: () => import('./views/InvitePlayers') },
    { path: '/room/:room', component: () => import('./views/RoomView') },
    { path: '/join/:room', component: () => import('./views/JoinGame') },
    { path: '/wallet', component: () => import('./views/Wallet') }
  ]
})

Vue.mixin({
  data: function() {
    return {
      get translateToLang() {
        return {
          create_new_game: {
            ru: 'или создай новую игру',
            en: 'or create a new game'
          },
          scan_qr: {
            ru: 'Отсканируй QR код и присоединись',
            en: 'Scan QR Code to connect'
          },
          whats_ur_name: {
            ru: 'Как тебя зовут?',
            en: 'What is your name?'
          },
          lets_set: {
            ru: 'Ок, давай все настроим!',
            en: 'Ok, lets set it up!'
          },
          back: {
            ru: 'Назад',
            en: 'Go back'
          },
          required_field: {
            ru: 'Это обязательное поле',
            en: 'This field is required'
          },
          three_min: {
            ru: 'Минимальная длинна - 3 символа',
            en: '3 characters is a minimal length'
          },
          err501: {
            ru: 'Ой, что-то пошло не по плану',
            en: 'Oops, something went wrong'
          },
          ready_to_play: {
            ru: 'Готов к игре',
            en: 'Ready to play'
          },
          waiting4players: {
            ru: 'Ожидаем игроков',
            en: 'Waiting for players'
          },
          start_the_game: {
            ru: 'Начать игру',
            en: 'Start the game'
          },
          join_the_game: {
            ru: 'Присоединиться к игре',
            en: 'Join the game'
          },
          taxes_included: {
            ru: 'Все налоги включены',
            en: 'All taxes are included'
          },
          money_transfer: {
            ru: 'Денежный перевод',
            en: 'Money transfer'
          },
          choose_from_contacts: {
            ru: 'Выберите получателя из ваших контактов',
            en: 'Choose a recipient from your contacts'
          }
        }
      },
      get currentLang() {
        return localStorage.getItem('lang') || 'en'
      }
    }
  }
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
