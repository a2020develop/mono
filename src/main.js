import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAnime from 'vue-animejs'
import VueRouter from 'vue-router'
import VuePageTransition from 'vue-page-transition'
import VueNativeNotification from 'vue-native-notification'
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
Vue.use(VueNativeNotification, { requestOnNotify: true })

Vue.config.productionTip = false

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/start' },
    { path: '/', component: () => import('./views/Start') },
    { path: '/start', component: () => import('./views/Start') },
    { path: '/create', component: () => import('./views/NewGame') },
    { path: '/create/invite-players', component: () => import('./views/InvitePlayers') },
    { path: '/room/:room', component: () => import('./views/RoomView') },
    { path: '/join/:room', component: () => import('./views/JoinGame') },
    { path: '/wallets', component: () => import('./views/WalletSelect') },
    { path: '/wallets/:wallet', component: () => import('./views/Wallet') }
  ]
})

const store = new Vuex.Store({
  state: {
    start_money: 3500,
    start_bank_money: 2000000,
    send_push: true,
    l: 'en',
    t: {
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
      },
      recipient: {
        ru: 'Получатель',
        en: 'Recipient'
      },
      amount: {
        ru: 'Сумма',
        en: 'Amount'
      },
      bank_transfer: {
        ru: 'Банковский перевод',
        en: 'Bank transfer'
      },
      from: {
        ru: 'от',
        en: 'from'
      },
      to: {
        ru: 'на акк.',
        en: 'to'
      },
      start_money: {
        ru: 'Деньги',
        en: 'Start money'
      },
      send_push: {
        ru: 'Отправлять push-уведомления о каждой транзакции',
        en: 'Send push notifications on each transaction '
      },
      notifications: {
        ru: 'уведомления',
        en: 'notifications'
      },
      welcome_to: {
        ru: 'Добро пожаловать в',
        en: 'Welcome to'
      },
      logout: {
        ru: 'Выйти',
        en: 'Log Out'
      },
      your_cards: {
        ru: 'Ваши счета',
        en: 'Your cards'
      }
    }
  },
  getters: {
    language: state => { return state.language },
    start_money: state => { return state.start_money },
    start_bank_money: state => { return state.start_bank_money },
    send_push: state => { return state.send_push },
    t: state => { return state.t },
    l: state => { return state.l },
  },
  actions: {
    start_money_Set (context, payload) {
      context.commit('start_money_Update', payload)
    },
    language_Set (context, payload) {
      context.commit('language_Update', payload)
    }
  },
  mutations: {
    start_money_Update (state, payload) {
      state.start_money = payload
    },
    language_Update (state, payload) {
      state.l = payload
    }
  }
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
          },
          recipient: {
            ru: 'Получатель',
            en: 'Recipient'
          },
          amount: {
            ru: 'Сумма',
            en: 'Amount'
          },
          bank_transfer: {
            ru: 'Банковский перевод',
            en: 'Bank transfer'
          },
          from: {
            ru: 'от',
            en: 'from'
          },
          to: {
            ru: 'на акк.',
            en: 'to'
          },
          start_money: {
            ru: 'Стартовая сумма',
            en: 'Start money'
          },
          send_push: {
            ru: 'Отправлять push-уведомления о каждой транзакции',
            en: 'Send push notifications on each transaction '
          },
          notifications: {
            ru: 'уведомления',
            en: 'notifications'
          },
          welcome_to: {
            ru: 'Добро пожаловать в',
            en: 'Welcome to'
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
  store,
  render: h => h(App)
}).$mount('#app')
