<template>
  <div>
    <div v-if="host.length > 0 && room">
        <v-card style="display:none">
          <v-toolbar flat>
            <template v-slot:extension>
              <v-tabs
                v-model="currentItem"
                fixed-tabs
                slider-color="white"
              >
                <v-tab
                  v-for="item in items"
                  :key="item"
                  :href="'#tab-' + item"
                >
                  {{ item }}
                </v-tab>

                <v-menu
                  v-if="more.length"
                  bottom
                  left
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      text
                      class="align-self-center mr-4"
                      v-bind="attrs"
                      v-on="on"
                    >
                      more
                      <v-icon right>
                        mdi-menu-down
                      </v-icon>
                    </v-btn>
                  </template>

                  <v-list class="grey lighten-3">
                    <v-list-item
                      v-for="item in more"
                      :key="item"
                      @click="addItem(item)"
                    >
                      {{ item }}
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-tabs>
            </template>
          </v-toolbar>

          <v-tabs-items v-model="currentItem">
            <v-tab-item
              v-for="item in items.concat(more)"
              :key="item"
              :value="'tab-' + item"
            >
              <v-card flat>
                <v-card-text>
                  <h2>{{ item }}</h2>
                  {{ text }}
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>

        <qrcode-vue :value="'https://' + host + '/join/' + room" :size="240" level="H"></qrcode-vue>
    </div>
    <div v-else class="invite-players">
      <div>
        <h1>501</h1>
        <div>{{ translateToLang.err501[currentLang] }}</div>
        <router-link to="/start">🠐 {{ translateToLang.back[currentLang] }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'gameSetup',
  components: {
    QrcodeVue
  },
  data: () => ({    
    host: '',
    room: '',
    currentItem: 'tab-Web',
    items: ['Web', 'Shopping', 'Videos', 'Images',],
    more: ['News', 'Maps', 'Books', 'Flights', 'Apps'],
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  }),
  methods: {
    addItem (item) {
      const removed = this.items.splice(0, 1)
      this.items.push(
        ...this.more.splice(this.more.indexOf(item), 1),
      )
      this.more.push(...removed)
      this.$nextTick(() => { this.currentItem = 'tab-' + item })
    },
    getHost() {
      this.host = window.location.host
    },
    getRoom() {
      this.room = localStorage.getItem('room')
    }
  },
  mounted() {
    this.getHost()
    this.getRoom()
  }
}
</script>

<style scoped>
  .invite-players {
    height: 95vh;
    display: flex;    
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
</style>