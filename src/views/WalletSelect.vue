<template>
    <div class="wallet-select">
        <div class="my-balance">
            <v-list-item two-line class="pl-0 pr-0">
                <v-list-item-avatar color="primary white--text">
                    <small>BANK</small>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title>{{ this.$store.getters.t.your_cards[this.$store.getters.l] }}</v-list-item-title>
                    <v-list-item-subtitle>Mono Poly Bank</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                    <span><v-icon>mdi-credit-card-scan</v-icon></span>
                </v-list-item-action>
            </v-list-item>
        </div>
        <div class="my-wallets">
            <div class="my-wallet" :class="`${acc.id}`" :id="`${acc.id}`" v-on:click="activeCardUpdate(acc.id)" v-for="acc in myAccounts" :key="acc.id">
                <div class="account-box">
                    <my-card class="card"
                        provider="visa" 
                        bankName="MONO POLY BANK" 
                        slogan="1st VIRTUAL BANK"
                        :number="acc.account_number"
                        :owner="findOwnerName(acc.account_owner_id)"
                        :priceSlot="acc.account_balance">
                    </my-card>
                </div>
            </div>
        </div>
        <router-link :to="`/wallets/${activeCard}`" class="wallet-control" v-if="activeCard.length > 0">
            <v-icon>mdi-arrow-right</v-icon>
        </router-link>
    </div>
</template>

<script>
import MyCard from '../components/MyCard'

import firebase from '../firebase'
const db = firebase.database()

export default {
    name: 'Wallet',
    firebase: {
        players: db.ref().child('rooms').child(localStorage.getItem('room')).child('players'),
        player: db.ref().child('rooms').child(localStorage.getItem('room')).child('players').child(localStorage.getItem('player')),
        accounts: db.ref().child('rooms').child(localStorage.getItem('room')).child('bank_accounts'),
        player_transactions: db.ref().child('rooms').child(localStorage.getItem('room')).child('player_transactions'),
        rooms: db.ref().child('rooms')
    },
    components: {
        MyCard
    },
    data: () => ({
        player: [],
        players: [],
        accounts: [],
        activeCard: '',
        player_transactions: [],
        currentAccountPlayer: '',
        oneScreen: window.innerWidth - 25,
        currenSwipeState: 1,
        dialog: false,
        transaction_to: '',
        transaction_from: '',
        transaction_amount: 0,
        number: 0,
        tweenedNumber: 0
    }),
    methods: {
        findOwnerName(id) {
            for (let i = 0; i < this.players.length; i++) {
                if(this.players[i].id == id) { return this.players[i].card_holder }
            }
            return ''
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        generateRandom(length = 20) {
            let result = ''
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            for ( let i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * characters.length))
            }
            return result
        },
        activeCardUpdate(id) {
            this.activeCard = id

            let cards = document.getElementsByClassName('my-wallet')
            let active = document.getElementById(this.activeCard)

            for ( let i = 0; i < cards.length; i++ ) {
                cards[i].style.transform = 'unset'
                cards[i].childNodes[0].childNodes[0].childNodes[0].style.boxShadow = 'none'
                if(i > 0) {
                    if(cards[i].classList.contains(id)) {
                        cards[i].style.transform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0.0001, 0, 0, 1, 0, 0, -160, 0, 1)'
                        cards[i-1].style.transform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0.0003, 0, 0, 1, 0, 0, 10, 0, 1)'
                    }
                }
            }
            active.childNodes[0].childNodes[0].childNodes[0].style.boxShadow = '0px 0px 0px 3px #1976d2'
        }
    },
    computed: {
        myAccounts() {
            let myAccounts = []
            for (let i = 0; i < this.accounts.length; i++) {
                const account = this.accounts[i]

                if(account.account_controlling_by == localStorage.getItem('player')) {
                    myAccounts.push(account)
                }
            }

            return myAccounts
        },
        transaction_toFiltered() {
            return this.findOwnerName(this.transaction_to)
        },
        playersInTheRoom() {
            let playersByRoom = []
            for (let i = 0; i < this.players.length; i++) {
                const player = this.players[i]

                if(player.room == localStorage.getItem('room')) {
                    playersByRoom.push(player)
                }
            }

            return playersByRoom
        }
  },
  mounted() {
    if (!localStorage.getItem('player')) {
        this.$router.push('/start')
    }

  }
}
</script>

<style scoped>
    .my-balance, .card, .transactions, .transfer {
        max-width: 315px;
        margin: 0 auto;
        width: 100%;
    }
    .my-wallet {
        transition: 0.2s;
        transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0.0003, 0, 0, 1, 0, 0, -120, 0, 1)
    }
    .my-wallet:nth-child(1){
        transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0.0003, 0, 0, 1, 0, 0, 10, 0, 1)
    }
    .headline {
        text-transform: uppercase;
        font-size: 15px !important
    }
    .rem-text-msg{
        margin-bottom: -25px;
        text-transform: capitalize;
    }
    .account-box{
        min-width: 305px;
    }
    .transfer {
        width: 100%;
        min-height: 45px;
        border-radius: 10px;
        background: #1867c0;
        margin-top: 15px !important;
        margin-bottom: 15px !important;
        padding: 7px 15px;
        color: white;
    }
    .transfer-dialog {
        display: flex;
    }
    .transfer-dialog .v-icon {
        margin-left: auto;
        color: white;
    }
    .transfer-dialog h2{
        text-transform: uppercase;
        font-weight: 300;
        line-height: 10px;
        padding-top: 8px;
        font-size: 18px;
    }
    .my-wallet {
        width: 100%;
        margin: auto;
    }
    .wallet-select {
        position: relative;
        overflow: hidden;
    }
    .wallet-control {
        position: absolute;
        right: 0;
        top: 0;
        margin-top: 39%;
        background: #ffffffb3;
        height: 200px;
        width: 200px;
        padding: 25% 10px;
        border-radius: 50%;
        margin-right: -150px;
        transition: 0.2s;
        box-shadow: 0 0 2px #0000007d;
    }
</style>