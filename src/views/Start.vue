<template>
    <div class="start">
        <div class="start--inner">
            <a>{{ this.$store.getters.t.scan_qr[this.$store.getters.l] }}</a>
            <div class="connect-to-a-game">
                <img src="../../public/expl/expl-1.png" class="fluid-img">
                <img src="../../public/expl/expl-2.png" class="absoluted-expl-1"
                    v-anime="{ translateY: 7, duration: 2000, loop: true, direction: 'alternate' }">
                <img src="../../public/expl/expl-3.png" class="absoluted-expl-2"
                    v-anime="{ translateY: 8, duration: 2500, loop: true, direction: 'alternate' }">
                <video id="video" width="1" height="1" autoplay></video>
            </div>
            <div class="create-new-game">
                <router-link to="/create">{{ this.$store.getters.t.create_new_game[this.$store.getters.l] }}</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({})
}
</script>

<style scoped>
    .start {
        height: calc(100vh - 100px);
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .start .create-new-game {
        width: 100%;
    }
    .start .create-new-game a {
        text-decoration: underline;
    }
    .fluid-img{
        width: 100%;
        max-width: 260px;
        opacity: 0.9;
    }
    .start .connect-to-a-game {
        position: relative;   
    }
    .absoluted-expl-1, .absoluted-expl-2 {
        position: absolute;
    }
    .absoluted-expl-1 {
        right: 0;
        width: 180px;
        top: 40px;
    }
    .absoluted-expl-2{
        left: 0;
        bottom: 0;
        margin-bottom: 80px;
        width: 130px;
        margin-left: 10px;
    }
</style>