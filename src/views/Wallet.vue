<template>
    <div>
        <div v-for="acc in myAccounts" :key="acc.id" class="account-box">
            <div class="my-balance">
                <div class="b"><small>$</small>{{ formatPrice(acc.account_balance) }}</div>
                <div class="ml"><v-icon>mdi-cog</v-icon></div>
                <div class="taxes-included">{{ translateToLang.taxes_included[currentLang] }}</div>
            </div>
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
            <div class="transfer">
                <v-dialog v-model="dialog" persistent max-width="350">
                    <template v-slot:activator="{ on, attrs }">
                        <div class="transfer-dialog" dark v-bind="attrs" v-on="on">
                            <div class="transfer-dialog--inner">
                                <h2>{{ translateToLang.money_transfer[currentLang] }}</h2>
                                <div>
                                    <small>{{ translateToLang.choose_from_contacts[currentLang] }}</small>
                                </div>
                            </div>
                            <v-icon>mdi-bank-transfer</v-icon>
                        </div>
                    </template>
                    <v-card>
                        <v-card-title class="headline">
                            Use Google's location service?
                        </v-card-title>
                        <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="green darken-1"
                                text
                                @click="dialog = false"
                            >
                                Disagree
                            </v-btn>
                            <v-btn
                                color="green darken-1"
                                text
                                @click="dialog = false"
                            >
                                Agree
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
            <div class="transactions">
                <v-list-item v-for="myTransaction in myTransactions" :key="myTransaction.id">
                    
                    <v-list-item-avatar v-if="myTransaction.type == 'min'" color="primary" class="white--text">
                        {{ findOwnerName(myTransaction.transaction_to).substr(0,1) || 'A' }}
                    </v-list-item-avatar>
                    <v-list-item-avatar v-else color="primary" class="white--text">
                        {{ findOwnerName(myTransaction.transaction_from).substr(0,1) || 'A' }}
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>
                            <span v-if="myTransaction.type == 'min'">-</span>
                            <span v-else>+</span>
                            {{ formatPrice(myTransaction.transaction_amount) }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            Bank transfer from
                            <span v-if="myTransaction.type == 'min'">{{ findOwnerName(myTransaction.transaction_to) || 'Anonymous' }}</span>
                            <span v-else>{{ findOwnerName(myTransaction.transaction_from) || 'Anonymous' }}</span>
                        </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                        
                    </v-list-item-action>
                </v-list-item>
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
    rooms: db.ref().child('rooms')
  },
  data: () => ({
    player: [],
    players: [],
    accounts: [],
    player_transactions: [],
    oneScreen: window.innerWidth - 25,
    currenSwipeState: 1,
    dialog: false
  }),
  methods: {
    findOwnerName(id) {
        for (let i = 0; i < this.players.length; i++) {
            const p = this.players[i]

            if(p.id == id) {
                return p.card_holder
            }
        }

        return ''
    },
    formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
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
      myTransactions() {
        let transactions = []
        for (let i = 0; i < this.player_transactions.length; i++) {
            const transaction = this.player_transactions[i]

            if(transaction.transaction_from == localStorage.getItem('player')) {
                transaction.type = 'min'
                transactions.push(transaction)
            } 
            
            if(transaction.transaction_to == localStorage.getItem('player')) {
                transaction.type = 'plus'
                transactions.push(transaction)
            } 
        }

        return transactions
      },

  },
  mounted() {
    if (!localStorage.getItem('player')) {
        this.$router.push('/start')
    }
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
    .card {
        padding-top: 5px;
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

    .account-box{
        float: left;
        min-width: 305px;
    }
    .my-balance{
        padding: 8px 1px;
        font-weight: 500;
        font-size: 25px;
        color: #484848;
        display: flex;
        margin-bottom: 10px;
        position: relative;
    }
    .my-balance > .b {
        max-width: 300px;
        overflow: hidden;
        margin-left: 1px;
    }
    .ml {
        margin-left: auto;
    }
    .taxes-included {
        position: absolute;
        font-size: 12px;
        bottom: 0;
        margin-left: 2px;
    }
    .transactions {
        padding: 0 18px;
    }
    .transactions .v-list-item {
        padding: 0;
        padding-left: 3px;
        padding-right: 2px;
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

    .my-balance, .card-body, .transactions, .transfer {
        max-width: 315px;
        margin: 0 auto;
        width: 100%;
    }
</style>