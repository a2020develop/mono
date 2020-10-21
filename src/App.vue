<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <Settings></Settings>
    </v-navigation-drawer>

    <v-app-bar app flat white class="animate-nav">
      <v-container class="mobile-preset">
        <v-app-bar-nav-icon small v-on:click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="mobile-preset">
        <vue-page-transition name="fade-in-right" class="fade-in-right">
          <router-view></router-view>
        </vue-page-transition>
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
import Settings from './components/Settings.vue'

export default {
  name: 'App',
  components: {
    Settings
  },
  data: () => ({
    drawer: false,
    group: null,
  }),
  methods: {
    toggleFullscreen() {
      document.getElementById("#app")
    }
  },
  watch: {
    group () {
      this.drawer = false
    },
  },
  mounted() {
    this.toggleFullscreen()
  }
};
</script>

<style>
  a {
    text-decoration: unset !important
  }
  .back-arrow {
    margin-top: -3px;
  }
  .mobile-preset {
    width: 100% !important;
    max-width: 700px !important;
    overflow: hidden !important;
  }
  @keyframes fadeInRight {
    from {
      transform: translate3d(40px, 0, 0);
    }

    to {
      transform: translate3d(0, 0, 0);
      opacity: 1
    }
  }
  @keyframes fadeOutLeft {
    from {
      transform: translate3d(0, 0, 0);
      opacity: 1
    }

    to {
      transform: translate3d(-40px, 0, 0);
    }
  }
  .fade-in-right-leave-to {
    opacity: 0;
    animation-duration: 0.2s;
    animation-name: fadeOutLeft;
  }
  .fade-in-right-enter {
    opacity: 0;
    transform: translate3d(40px, 0, 0);
  }
  .fade-in-right-enter-to {
    opacity: 0;
    animation-duration: 0.2 s;
    animation-fill-mode: both;
    animation-name: fadeInRight;
  }
  .animate-nav{
    animation-delay: 1.5s;
    transition: 0.2s;
    position: fixed;
    top: 0;
    max-width: 100%;
  }
  .v-toolbar__content {
    max-width: 340px;
    margin: auto;
    padding: 0 !important;
  }
  .cap {
    text-transform: capitalize !important;
  }
  .fs-18{
    font-size: 18px;
  }
  .chip-u {
    cursor: pointer;
  }
</style>