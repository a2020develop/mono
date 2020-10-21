<template>
    <div class="my-balance">
        <div class="b">
            <small>$</small>
            <animated-number :value="value" :formatValue="formatPrice" :duration="duration"></animated-number>
        </div>
        <div class="ml">
            <v-avatar color="primary" class="white--text my-first-letter" size="30">
                {{ owner }}
            </v-avatar>
        </div>
        <div class="taxes-included">{{ taxes }}</div>
    </div>
</template>

<script>
import AnimatedNumber from "animated-number-vue"

export default {
    props: ['value', 'duration', 'owner', 'taxes'],
    components: {
        AnimatedNumber
    },
    methods: {
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
    }
}
</script>

<style scoped>
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
    .my-first-letter {
        font-size: 15px;
        margin-top: 4px;
    }
</style>