<template>
    <div class="transactions">
        <v-list-item v-for="transaction in transactionsSorted" :key="transaction.id">
            <v-list-item-avatar v-if="transaction.type == 'min'" color="primary" class="white--text">
                {{ ident(transaction.transaction_to).substr(0,1) }}
            </v-list-item-avatar>
            <v-list-item-avatar v-else color="primary" class="white--text">
                {{ ident(transaction.transaction_from).substr(0,1) }}
            </v-list-item-avatar>

            <v-list-item-content>
                <v-list-item-title>
                    <span v-if="transaction.type == 'min'">-</span><span v-else>+</span> {{ formatPrice(transaction.transaction_amount) }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    {{ bank_transfer }}
                    <span v-if="transaction.type == 'min'">{{ trans_to }} </span>
                    <span v-else>{{ trans_from }} </span>

                    <span v-if="transaction.type == 'min'">{{ ident(transaction.transaction_to) }}</span>
                    <span v-else>{{ ident(transaction.transaction_from) }}</span>
                </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
                <span v-if="transaction.type == 'min'"><v-icon class="red-out">mdi-transfer-up</v-icon></span>
                <span v-else><v-icon class="green-in">mdi-transfer-down</v-icon></span>
            </v-list-item-action>
        </v-list-item>
    </div>
</template>

<script>
export default {
    props: ['transactions', 'bank_transfer', 'trans_to', 'trans_from', 'players'],
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
        ident(i) {
            return this.findOwnerName(i) || 'Anonymous'
        }
    },
    computed: {
        transactionsSorted() {
            return this.transactions
        }
    }
}
</script>

<style scoped>
    .transactions {
        padding: 2px;
    }
    .transactions .v-list-item {
        padding: 0;
        padding-left: 3px;
        padding-right: 2px;
    }
    .red-out{
        color: #cc4c4c;
    }
    .green-in{
        color: #1c9621;
    }
</style>