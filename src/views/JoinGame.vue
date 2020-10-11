<template>
    <div class="new-game">
        <div class="fluid">
            <div class="titled">
                <h1 class="set-up">{{ translateToLang.lets_set[currentLang] }}</h1>
                <div class="hidden-load" v-if="loading">
                    <v-icon color="primary" v-anime="{ rotate: 1001010, duration: 900000, loop: true, easing: 'linear'}">mdi-loading</v-icon>
                </div>
            </div>
            <v-text-field
                v-model="namefield" outlined
                :label="translateToLang.whats_ur_name[currentLang]"
            ></v-text-field>
            <div class="absoluted-apply">
                <v-btn icon color="primary" v-on:click="joinGame()"><v-icon>mdi-check</v-icon></v-btn>
            </div>
            <router-link to="/start"><v-icon class="back-arrow">mdi-arrow-left</v-icon> {{ translateToLang.back[currentLang] }}</router-link>
        </div>
    </div>
</template>

<script>
import firebase from '../firebase'
const db = firebase.database()

export default {
    name: 'JoinGame',
    firebase: {
        players: db.ref().child('players'),
        rooms: db.ref().child('rooms')
    },
    data: () => ({
        namefield: '',
        players: [],
        rooms: [],
        room: '',
        player: '',
        bank: '',
        bank_account: '',
        loading: false
    }),
    methods: {
        joinGame() {
            this.loading = true

            if(this.namefield != '') {
                let gameroom = this.getRoom()
                this.room = gameroom

                let controlling_by = this.createPlayer(this.namefield, gameroom)
                this.createBankAccount(controlling_by, controlling_by)
                this.saveLocalConfig()

                firebase.database().ref('players/' + controlling_by).update({
                    room: gameroom
                })

                setTimeout(() => { 
                    this.loading = false;
                    this.$router.push('/room/' + this.room)
                }, 2000)
            } 
            else { 
                this.loading = false
                return 
            }
        },
        getHost() {
            this.host = window.location.host
        },
        getRoom() {
            return this.$route.params.room
        },
        getMe() {
            this.me = localStorage.getItem('player')
        },
        startTheGame() {
            this.$router.push('/wallet')
        },
        saveLocalConfig() {
            localStorage.setItem('room', this.room)
            localStorage.setItem('player', this.player)
        },
        createPlayer(name, room) {
            this.player = this.generateRandom()
            firebase.database().ref('players/' + this.player).set({
                id: this.player,
                card_holder: name,
                room: room
            })

            return this.player
        },
        createBankAccount(owner_id, controlling_by, account_balance = 5000000) {
            let account = ''
            if(owner_id == controlling_by) {
                this.bank_account = this.generateRandom()
                account = this.bank_account
            } else {
                account = this.generateRandom()
            }

            firebase.database().ref('bank_accounts/' + account).set({
                id: account,
                account_balance: account_balance,
                account_controlling_by: controlling_by,
                account_owner_id: owner_id,
                account_number: "4441 " + Math.round(Math.random() * (9999 - 1000) + 1000) + " 0101 " + Math.round(Math.random() * (9999 - 1000) + 1000),
            })

            return account
        },
        generateRandom(length = 20) {
            let result = ''
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            for ( let i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * characters.length))
            }
            return result
        }
    },
    mounted() {}
}
</script>

<style scoped>
    .new-game {
        height: 95vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }

    h1.set-up {
        font-size: 20px;
        width: 100%;
        margin-bottom: 5px;
        color: #444141;
        font-weight: 400;
    }
    .fluid{
        width: 100%;
        font-weight: 400;
        position: relative;
    }
    .absoluted-apply > .v-btn{
        position: absolute;
        right: 0;
        top: 0;
        margin-top: 45px;
        margin-right: 10px;
    }
    .titled {
        display: flex;
    }
</style>