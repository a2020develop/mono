<template>
  <div>
    <div v-if="host.length > 0 && room">
        <div class="invite-players-qr">
          <div class="titled">
              <div class="set-up">
                <div class="ico-marg">
                  <v-icon v-anime="{ translateY: -5, duration: 1600, loop: true, direction: 'alternate' }">mdi-account-reactivate</v-icon>
                </div>
                <div>{{ this.$store.getters.t.waiting4players[this.$store.getters.l] }}</div>
              </div>
          </div>
          <div class="code">
            <qrcode-vue :value="'http://' + host + '/#/join/' + room" :size="240" level="H"></qrcode-vue>
          </div>
          <div class="players">
            <v-list subheader two-line>
              <v-list-item v-for="player in filteredPlayers" :key="player.id" class="p-0">
                <v-list-item-avatar color="primary">
                  <span class="white--text headline fs-20">{{ player.card_holder.substr(0, 1) }}</span>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="cap" v-text="player.card_holder"></v-list-item-title>
                  <v-list-item-subtitle>
                    <span>
                      <v-icon class="fs-20" color="success">mdi-check</v-icon>
                    </span>
                    <span>Ready to play</span>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon :disabled="player.card_holder == 'The Bank' || player.id == me"
                    v-on:click="removePlayer(player.id)">
                    <v-icon v-bind:class="{ errortext: player.card_holder != 'The Bank' && player.id != me }">mdi-account-remove-outline</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>

            <div class="start-game">
              <v-btn depressed v-on:click="startTheGame()" v-if="!checkRoom">{{ this.$store.getters.t.start_the_game[this.$store.getters.l] }}</v-btn>
              <v-btn depressed v-on:click="startTheGame()" v-else>{{ this.$store.getters.t.join_the_game[this.$store.getters.l] }}</v-btn>
            </div>
          </div>
        </div>
    </div>
    <div v-else class="invite-players">
      <div>
        <h1>501</h1>
        <div>{{ this.$store.getters.t.err501[this.$store.getters.l] }}</div>
        <router-link to="/start"><v-icon class="back-arrow">mdi-arrow-left</v-icon> {{ this.$store.getters.t.back[this.$store.getters.l] }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import firebase from '../firebase'
const db = firebase.database()

export default {
  name: 'InvitePlayers',
  firebase: {
    players: db.ref().child('rooms').child(localStorage.getItem('room')).child('players'),
    rooms: db.ref().child('rooms')
  },
  components: {
    QrcodeVue
  },
  data: () => ({    
    host: '',
    room: '',
    rooms: [],
    players: [],
    me: '',
    loading: true
  }),
  methods: {
    getHost() {
      this.host = window.location.host
    },
    getRoom() {
      this.room = localStorage.getItem('room')
    },
    getMe() {
      this.me = localStorage.getItem('player')
    },
    removePlayer(id) {
      firebase.database().ref('players/' + id).update({
        room: ''
      })
    },
    startTheGame() {
      firebase.database().ref('rooms/' + localStorage.getItem('room')).update({
        is_game_started: 'true'
      })
      
      this.$router.push('/wallets')
    }
  },
  mounted() {
    this.getHost()
    this.getRoom()
    this.getMe()
  },
  computed: {
    filteredPlayers: function () {
      let filtered = []
      for (let index = 0; index < this.players.length; index++) {
        const player = this.players[index]

        if (player.room == this.room) {
          filtered.push(player)
        }
      }
      
      return filtered
    },
    checkRoom() {
      for (let index = 0; index < this.rooms.length; index++) {
        const room = this.rooms[index]

        if (room.id == this.room) {
          if ('is_game_started' in room) {
            return true
          }
        }
      }

      return false
    }
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
  .headline{
    text-transform: capitalize !important;
  }

  .invite-players-qr .code{
    display: flex;    
    justify-content: center;
    padding: 20px;
  }

  .invite-players-qr .players {
    max-width: 250px;
    margin: auto;
  }

  .p-0 {
    padding: 0 !important;
  }

  .fs-20 {
    font-size: 20px!important;
  }
  .titled {
    display: flex;
    max-width: 250px;
    margin: auto;
    margin-top: 30px;
    padding: 0 3px;
  }

  .titled .set-up {
    display: flex;
    align-items: center;
  }

  .titled .set-up{
    width: calc(100% - 24px);
    font-size: 20px;
    color: #444141;
    font-weight: 400;
  }

  .ico-marg {
    margin-top: 5px;
    padding-right: 4px;
  }

  .start-game{
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .errortext{
    color: #ff6c6c !important
  }
  
  .invite-players-qr .players{
    padding: 0 5px !important;
  }
</style>