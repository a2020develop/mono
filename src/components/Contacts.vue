<template>
    <div>{{ players }}</div>
</template>

<script>
import firebase from '../firebase'
const db = firebase.database()

export default {
    name: 'Contacts',
    firebase: {
        players: db.ref().child('players')
    },
    data: () => ({
        players: []
    }),
}
</script>

<style scoped>

</style>