<template>
  <div>
    <div v-if="host.length > 0 && room">
        <div class="invite-players-qr">
          <div class="titled">
              <div class="set-up">
                <div>{{ translateToLang.waiting4players[currentLang] }}</div>
              </div>
          </div>
          <div class="players">
            <v-list subheader two-line>
              <v-list-item v-for="player in filteredPlayers" :key="player.id" class="p-0">
                <v-list-item-avatar color="primary">
                  <span class="white--text headline fs-20">{{ player.card_holder.substr(0, 1) }}</span>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="player.card_holder"></v-list-item-title>
                  <v-list-item-subtitle>
                    <span>
                      <v-icon class="fs-20" color="success">mdi-check</v-icon>
                    </span>
                    <span>{{ translateToLang.ready_to_play[currentLang] }}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon :disabled="player.card_holder == 'The Bank' || player.id == me"
                    v-on:click="removePlayer(player.id)">
                    <v-icon color="grey lighten-1">mdi-check</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>

            <div class="start-game">
                <div class="hidden-load" v-if="!checkRoom">
                    <v-icon color="primary" v-anime="{ rotate: 1001010, duration: 1600000, loop: true, easing: 'linear'}">mdi-loading</v-icon>
                </div>
                <v-btn depressed v-on:click="startTheGame()" v-else>{{ translateToLang.join_the_game[currentLang] }}</v-btn>
            </div>
          </div>
        </div>
    </div>
    <div v-else class="invite-players">
      <div>
        <h1>501</h1>
        <div>{{ translateToLang.err501[currentLang] }}</div>
        <router-link to="/start"><v-icon class="back-arrow">mdi-arrow-left</v-icon> {{ translateToLang.back[currentLang] }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from '../firebase'
const db = firebase.database()

export default {
  name: 'RoomView',
  firebase: {
    players: db.ref().child('rooms').child(localStorage.getItem('room')).child('players'),
    rooms: db.ref().child('rooms')
  },
  data: () => ({    
    host: '',
    room: '',
    rooms: [],
    players: [],
    me: ''
  }),
  methods: {
    getDefaults() {
      this.host = window.location.host
      this.room = localStorage.getItem('room')
      this.me = localStorage.getItem('player')
    },
    startTheGame() {
      firebase.database().ref('rooms/' + localStorage.getItem('room') + '/players/' + localStorage.getItem('player')).update({
        room: localStorage.getItem('room')
      })

      this.$router.push('/wallets')
    }
  },
  mounted() {
    this.getDefaults()
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
</style>