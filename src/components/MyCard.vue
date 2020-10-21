<template>
    <div class="card black-card">
        <div class="card-body">
            <div class="card-body--inner">
                <div class="card-name">
                    <div class="card-name--inner">
                        <h2 class="font-weight-light">{{ bankName }}</h2> 
                        <div class="first-bank">{{ slogan }}</div>
                    </div>
                </div>
                <img src="../../public/chip.png" class="chip">
                <div class="card-number">
                    <h2>{{ number }}</h2>
                </div>
                <div class="card-holder">
                    <h2 class="cap">{{ owner }}</h2>
                </div>
            </div>
            <div class="b" v-if="priceSlot">
                <small>$</small>
                <animated-number :value="priceSlot" :formatValue="formatPrice" :duration="1200"></animated-number>
            </div>
            <img v-if="provider == 'visa'" src="../../public/visa.png" :class="provider">
        </div>
    </div>
</template>

<script>
import AnimatedNumber from "animated-number-vue"

export default {
    props: ['bankName', 'slogan', 'number', 'owner', 'provider', 'priceSlot'],
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
    .card-body{
        width: 100%;
        height: 200px;
        border-radius: 10px;
        margin: auto;
        position: relative;
        margin-bottom: 20px;
        overflow: hidden;
    }
    .card-name h2 {
        font-weight: 400 !important;
        font-size: 12px;
    }
    .card-name{
        padding: 13px 18px;
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
        box-shadow: 0px 0px 5px 3px #ffffff2b;
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
    .b{
        color: white;
        position: absolute;
        bottom: 0;
        margin: 10px 15px;
        font-size: 20px;
        font-weight: 900;
    }
</style>