<template>
    <div class="my-wallets">

        <carousel :perPage="1" :paginationEnabled="false">
            <slide v-for="acc in myAccounts" :key="acc.id">
            
            <div class="my-wallet">
                <div class="account-box">
                    <div class="my-balance">
                        <div class="b">
                            <small>$</small>
                            <animated-number :value="acc.account_balance" :formatValue="formatPrice" :duration="1200"></animated-number>
                        </div>
                        <div class="ml">
                            <v-avatar color="primary" class="white--text my-first-letter" size="30">
                                {{ findOwnerName(acc.account_owner_id).substr(0,1) }}
                            </v-avatar>
                        </div>
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
                                    <h2 class="cap">{{ findOwnerName(acc.account_owner_id) }}</h2>
                                </div>
                            </div>
                            <img src="../../public/visa.png" class="visa">
                        </div>
                    </div>
                    <div class="transfer">
                        <v-dialog v-model="acc.dialog" max-width="350">
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
                                <v-card-title class="headline"><v-icon>mdi-bank-transfer</v-icon> {{ translateToLang.money_transfer[currentLang] }}</v-card-title>
                                <v-card-text>
                                    <v-text-field :label="translateToLang.recipient[currentLang]" dense class="rem-text-msg" readonly
                                        :placeholder="translateToLang.recipient[currentLang]" outlined v-model="transaction_toFiltered"></v-text-field>
                                    <v-chip v-for="playerInTheRoom in playersInTheRoom" small
                                        :key="playerInTheRoom.id" class="ma-2 ml-0 cap chip-u"
                                        v-on:click="setInputSendTo(playerInTheRoom.id, acc.account_owner_id)">
                                        <v-icon left class="fs-18">mdi-account-circle-outline</v-icon>
                                        {{ playerInTheRoom.card_holder }}
                                    </v-chip>
                                    <div class="ma-5"></div>
                                    
                                    <v-text-field :label="translateToLang.amount[currentLang]" dense class="rem-text-msg" 
                                        pattern="[0-9]*" v-on:keypress="isNumber($event)"
                                        :placeholder="translateToLang.amount[currentLang]" 
                                        outlined v-model="transaction_amount">
                                    </v-text-field>
                                    <v-chip class="ma-2 ml-0 cap chip-u" small v-on:click="setInputAmount(5000)">{{ formatPrice(5000) }}</v-chip>
                                    <v-chip class="ma-2 ml-0 cap chip-u" small v-on:click="setInputAmount(10000)">{{ formatPrice(10000) }}</v-chip>
                                    <v-chip class="ma-2 ml-0 cap chip-u" small v-on:click="setInputAmount(20000)">{{ formatPrice(20000) }}</v-chip>

                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" text v-on:click="moneyTransfering()">OK</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>
                    <div class="transactions">
                        <v-list-item v-for="myTransaction in getMyTransactions(acc.account_owner_id)" :key="myTransaction.id">
                            
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
                                    {{ translateToLang.bank_transfer[currentLang] }}
                                    <span v-if="myTransaction.type == 'min'">{{ translateToLang.to[currentLang] }} </span>
                                    <span v-else>{{ translateToLang.from[currentLang] }} </span>
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

            </slide>
        </carousel>
    </div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel'
import AnimatedNumber from "animated-number-vue"
import firebase from '../firebase'
const db = firebase.database()

export default {
  name: 'Wallet',
  firebase: {
    players: db.ref().child('players'),
    player: db.ref().child('players').child(localStorage.getItem('player')),
    accounts: db.ref().child('bank_accounts'),
    player_transactions: db.ref().child('player_transactions').child(localStorage.getItem('room')),
    rooms: db.ref().child('rooms')
  },
  components: {
    Carousel,
    AnimatedNumber,
    Slide
  },
  data: () => ({
    player: [],
    players: [],
    accounts: [],
    player_transactions: [],
    currentAccountPlayer: '',
    oneScreen: window.innerWidth - 25,
    currenSwipeState: 1,
    dialog: false,
    transaction_to: '',
    transaction_from: '',
    transaction_amount: '',
    number: 0,
    tweenedNumber: 0
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
    isNumber: function(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault()
      } else {
        return true;
      }
    },
    formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    setInputSendTo(to, from) {
        this.transaction_to = to
        this.transaction_from = from
    },
    setInputAmount(a) {
        this.transaction_amount = a
    },
    moneyTransfering() {
        let id = this.generateRandom()
        if(this.transaction_to == this.transaction_from) {
            this.transaction_from = ''
            this.transaction_to = ''

            return 
        }

        if (this.transaction_amount > 0 && this.transaction_to.length > 0){
            firebase.database().ref('player_transactions/' + localStorage.getItem('room') + '/' + id).set({
                id: id,
                transaction_amount: this.transaction_amount,
                transaction_date: + new Date(),
                transaction_from: this.transaction_from,
                transaction_to: this.transaction_to
            })
            this.updateBalance('minus', this.transaction_amount, this.transaction_from)
            this.updateBalance('plus', this.transaction_amount, this.transaction_to)
            
            this.transaction_amount = 0
            this.transaction_from = ''
            this.transaction_to = ''
            this.dialog = false
        } else {
            return
        }
    },
    updateBalance(action, amount, player) {
        let amountToEdit = null
        let newAmount = null
        let accountId = null

        for (let i = 0; i < this.accounts.length; i++) {
            if (this.accounts[i].account_owner_id == player) {
                amountToEdit = this.accounts[i].account_balance
                accountId = this.accounts[i].id
            }
        }

        if (amountToEdit != null) {
            if (action == 'plus') { newAmount = amountToEdit + amount }
            if (action == 'minus') { newAmount = amountToEdit - amount }

            firebase.database().ref('bank_accounts/' + accountId).update({
                account_balance: newAmount
            })
        }
    },
    generateRandom(length = 20) {
        let result = ''
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * characters.length))
        }
        return result
    },
    getMyTransactions(player) {
        let transactions = []
        for (let i = 0; i < this.player_transactions.length; i++) {
            const transaction = this.player_transactions[i]
            if(transaction.transaction_from == player) {
                transaction.type = 'min'
                transactions.push(transaction)
            } 
            
            if(transaction.transaction_to == player) {
                transaction.type = 'plus'
                transactions.push(transaction)
            } 
        }

        return transactions
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
    .cap {
        text-transform: capitalize !important;
    }
    .fs-18{
        font-size: 18px;
    }
    .chip-u {
        cursor: pointer;
    }
    .headline {
        text-transform: uppercase;
        font-size: 15px !important
    }
    .my-first-letter {
        font-size: 15px;
        margin-top: 4px;
    }
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
    .rem-text-msg{
        margin-bottom: -25px;
        text-transform: capitalize;
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
        padding: 2px;
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

    .my-wallet {
        width: 100%;
        margin: auto;
    }
</style>