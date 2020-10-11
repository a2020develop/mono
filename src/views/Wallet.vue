<template>
    <div>
        <div v-for="acc in myAccounts" :key="acc.id">
            <div class="card black-card">
                <div class="card-body">
                    <div class="card-body--inner">
                        <div class="card-name">
                            <div class="card-name--inner">
                                <h2 class="font-weight-light">MONO POLY BANK</h2> 
                                <div class="first-bank">1st VIRTUAL BANK</div>
                            </div>
                        </div>
                        <img src="../../public/chip.png" class="chip">
                        <div class="card-number">
                            <h2>{{ acc.account_number }}</h2>
                        </div>
                        <div class="card-holder">
                            <h2>{{ findOwnerName(acc.account_owner_id) }}</h2>
                        </div>
                    </div>
                    <img src="../../public/visa.png" class="visa">
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import firebase from '../firebase'
const db = firebase.database()

export default {
  name: 'Wallet',
  firebase: {
    players: db.ref().child('players'),
    player: db.ref().child('players').child(localStorage.getItem('player')),
    accounts: db.ref().child('bank_accounts'),
    player_transactions: db.ref().child('player_transactions'),
    rooms: db.ref().child('rooms'),
  },
  data: () => ({
    player: [],
    players: [],
    accounts: [],
    player_transactions: [] 
  }),
  methods: {
    getMyCredentials() {
        console.log(this.player)
    },
    findOwnerName(id) {
        for (let i = 0; i < this.players.length; i++) {
            const p = this.players[i]

            if(p.id == id) {
                return p.card_holder
            }
        }

        return ''
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
      }
  },
  mounted() {
    this.getMyCredentials()
  }
}
</script>

<style scoped>
    .card-body{
        width: 100%;
        height: 200px;
        border-radius: 10px;
        max-width: 315px;
        margin: auto;
        position: relative;
        margin-bottom: 20px;
        overflow: hidden;
    }
    .card-name{
        padding: 13px 18px;
    }
    .card-name h2 {
        font-weight: 400 !important;
        font-size: 12px;
    }
    .visa{
        width: 60px;
        position: absolute;
        bottom: 0;
        right: 0;
        margin: 15px 15px;
    }
    .chip {
        height: 30px;
        padding: 0 17px;
    }
    .card-name--inner{
        display: flex;
        align-items: center;
    }

    .black-card .card-body {
        background: black;
    }
    .black-card .card-name h2 {
        color: #e4e4e4;
    }
    .black-card .card-number h2 {
        color: #e4e4e4;
        font-weight: 300;
        font-size: 18px;
        padding: 5px 17px;
        word-spacing: 7px;
        text-shadow: #6b6b6b 1px 0px 0px;
    }
    .black-card .card-holder h2 {
        color: #e4e4e4;
        font-weight: 300;
        font-size: 15px;
        padding: 0 17px;
    }
    .first-bank {
        color: #e4e4e4;
        border-left: 1px solid #6b6b6b;
        font-weight: 300;
        padding-left: 5px;
        margin-left: 5px;
        font-size: 10px;
    }
</style>