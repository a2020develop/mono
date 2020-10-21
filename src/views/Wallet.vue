<template>
    <div class="my-wallets">
        <div class="my-wallet" v-for="acc in myAccounts" :key="acc.id">
            <div class="account-box">
                <my-balance
                    :value="acc.account_balance" :duration="1200" 
                    :owner="findOwnerName(acc.account_owner_id).substr(0,1)" 
                    :taxes="translateToLang.taxes_included[currentLang]">
                </my-balance>
                <my-card class="card"
                    provider="visa" 
                    bankName="MONO POLY BANK" 
                    slogan="1st VIRTUAL BANK"
                    :number="acc.account_number"
                    :owner="findOwnerName(acc.account_owner_id)"
                ></my-card>

                <div class="transfer">
                    <v-dialog v-model="dialog" max-width="350">
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
                                <v-text-field dense class="rem-text-msg" readonly
                                    :label="translateToLang.recipient[currentLang]"
                                    :placeholder="translateToLang.recipient[currentLang]" 
                                    outlined v-model="transaction_toFiltered">
                                </v-text-field>
                                        
                                <v-chip v-for="playerInTheRoom in playersInTheRoom" small
                                    :key="playerInTheRoom.id" class="ma-2 ml-0 cap chip-u"
                                    v-on:click="setInputSendTo(playerInTheRoom.id, acc.account_owner_id)">
                                    <!-- <v-icon left class="fs-18">mdi-account-circle-outline</v-icon> -->
                                    {{ playerInTheRoom.card_holder }}
                                </v-chip>
                                
                                <div class="ma-5"></div>
                                        
                                <v-text-field :label="translateToLang.amount[currentLang]" dense class="rem-text-msg" 
                                    :placeholder="translateToLang.amount[currentLang]" 
                                    outlined v-model="transaction_amount">
                                </v-text-field>

                                <v-chip class="ma-2 ml-0 cap chip-u" small v-on:click="setInputAmount(10)">{{ formatPrice(10) }}</v-chip>
                                <v-chip class="ma-2 ml-0 cap chip-u" small v-on:click="setInputAmount(20)">{{ formatPrice(20) }}</v-chip>
                                <v-chip class="ma-2 ml-0 cap chip-u" small v-on:click="setInputAmount(50)">{{ formatPrice(50) }}</v-chip>
                                <v-chip class="ma-2 ml-0 cap chip-u" small v-on:click="setInputAmount(100)">{{ formatPrice(100) }}</v-chip>

                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" text v-on:click="moneyTransfering()">OK</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </div>

                <my-transactions
                    :transactions="getMyTransactions(acc.account_owner_id)"
                    :bank_transfer="translateToLang.bank_transfer[currentLang]"
                    :trans_to="translateToLang.to[currentLang]"
                    :trans_from="translateToLang.from[currentLang]"
                    :players="players"
                ></my-transactions>
            </div>
        </div>
        
        <router-link :to="`/wallets`" class="wallet-control">
            <v-icon>mdi-arrow-left</v-icon>
        </router-link>
    </div>
</template>

<script>
import MyBalance from '../components/MyBalance'
import MyCard from '../components/MyCard'
import MyTransactions from '../components/MyTransactions'

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
        MyBalance,
        MyTransactions,
        MyCard
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
    notify (amount, from, to) {
        this.$notification.show(`${this.translateToLang.bank_transfer[this.currentLang]}`, {
            body: `${this.formatPrice(amount)} ${this.translateToLang.from[this.currentLang]} ${from} ${this.translateToLang.to[this.currentLang]} ${to}`
        }, {})
    },
    setInputSendTo(to, from) {
        this.transaction_to = to
        this.transaction_from = from
    },
    setInputAmount(a) {
        this.transaction_amount = a
    },
    moneyTransfering() {
        console.log(this.transaction_amount)
        console.log(this.transaction_from)
        console.log(this.transaction_to)
        let id = this.generateRandom()
        if(this.transaction_to == this.transaction_from) {
            this.transaction_to = ''
            return 
        }

        if (this.transaction_amount > 0 && this.transaction_to.length > 0){
            firebase.database().ref('rooms/' + localStorage.getItem('room') + '/player_transactions/' + id).set({
                id: id,
                transaction_amount: this.transaction_amount,
                transaction_date: + new Date(),
                transaction_from: this.transaction_from,
                transaction_to: this.transaction_to
            })

            this.updateBalance('minus', this.transaction_amount, this.transaction_from)
            this.updateBalance('plus', this.transaction_amount, this.transaction_to)
            this.notify(this.transaction_amount, this.findOwnerName(this.transaction_from), this.findOwnerName(this.transaction_to))

            this.transaction_amount = 0
            this.transaction_to = ''
            this.dialog = false
        } else {
            return
        }
    },
    updateBalance(action, amount, player) {
        let amountToEdit = 0
        let accountId = ''

        for (let i = 0; i < this.accounts.length; i++) {
            console.log(this.accounts[i])
            if (this.accounts[i].account_owner_id == player) {
                amountToEdit = this.accounts[i].account_balance
                accountId = this.accounts[i].id
            }
        }

        let newAmount = 0
        if (amountToEdit != 0) {
            if (action == 'plus') { 
                newAmount = parseInt(amountToEdit) + parseInt(amount) 
            }
            if (action == 'minus') { 
                newAmount = parseInt(amountToEdit) - parseInt(amount) 
            }

            console.log(newAmount)
            console.log(accountId)
            console.log(amountToEdit)
            console.log(amount)
            console.log(player)
            console.log(action)

            firebase.database().ref('rooms/' + localStorage.getItem('room') + '/bank_accounts/' + accountId).update({
                account_balance: newAmount
            })
        }
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

            if(account.account_controlling_by == localStorage.getItem('player') && this.$route.params.wallet == account.id) {
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

    .my-wallets {
        position: relative;
        overflow: hidden;
    }
    .wallet-control {
        position: absolute;
        right: 0;
        top: 0;
        margin-top: 16%;
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