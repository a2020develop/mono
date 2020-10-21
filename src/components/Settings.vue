<template>
    <div style="padding: 15px">
        <v-list-item two-line class="pl-0">
            <v-list-item-avatar color="primary white--text">
                <small>BANK</small>
            </v-list-item-avatar>

            <v-list-item-content>
                <v-list-item-title>{{ this.$store.getters.t.welcome_to[this.$store.getters.l] }}</v-list-item-title>
                <v-list-item-subtitle>Mono Poly Bank</v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-divider class="mb-4"></v-divider>

        <v-select :items="languages" v-model="langSelected" label="English / Русский" dense outlined item-text="state" item-value="abbr"
            v-on:change="language_Update"></v-select>

        <v-spacer></v-spacer>
        <div class="mb-3">{{ this.$store.getters.t.start_money[this.$store.getters.l] }} Player/Bank</div>
        <v-text-field :label="this.$store.getters.t.amount[this.$store.getters.l]" dense class="rem-text-msg" 
            pattern="[0-9]*" v-on:keypress="isNumber($event)"
            :placeholder="this.$store.getters.t.amount[this.$store.getters.l]" 
            outlined :value="this.$store.getters.start_money"
            v-on:input="start_money_Update">
        </v-text-field>

        <v-spacer></v-spacer>
        <v-text-field :label="this.$store.getters.t.amount[this.$store.getters.l]" dense class="rem-text-msg" 
            pattern="[0-9]*" v-on:keypress="isNumber($event)" readonly
            :placeholder="this.$store.getters.t.amount[this.$store.getters.l]" 
            outlined :value="this.$store.getters.start_money *500">
        </v-text-field>

        <v-spacer></v-spacer>
        <div>Push-{{ this.$store.getters.t.notifications[this.$store.getters.l] }}</div>
        <v-switch
            v-model="send_push"
            :label="this.$store.getters.t.send_push[this.$store.getters.l]"
        ></v-switch>
        <v-spacer></v-spacer>
        <router-link to="/start">{{ this.$store.getters.t.logout[this.$store.getters.l] }}</router-link>
    </div>
</template>

<script>

export default {
    name: 'Settings',
    data: () => ({
        send_push: true,
        languages: [
          { state: 'English', abbr: 'en' },
          { state: 'Русский', abbr: 'ru' },
        ],
        langSelected: { 
            state: localStorage.getItem('l') == 'ru' ? 'Русский' : 'English', 
            abbr: localStorage.getItem('l') || 'en' 
        }
    }),
    methods: {
        isNumber: function(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault()
            } else {
                return true;
            }
        },
        start_money_Update (e) {    
            this.$store.dispatch('start_money_Set', e)
        },
        language_Update (e) {
            localStorage.setItem('l', e)
            this.$store.dispatch('language_Set', e)
        }
    },
    mounted() {
        this.$store.dispatch('language_Set', localStorage.getItem('l') || 'en')
    }
}
</script>

<style scoped>

</style>