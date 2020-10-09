<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer">
      <!-- -->
    </v-navigation-drawer>

    <v-app-bar app flat white
      v-if="this.$router.currentRoute.path != '/start' && this.$router.currentRoute.path != '/create'
         && this.$router.currentRoute.path != '/create/invite-players'">
      <v-container class="mobile-preset">
        <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
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

export default {
  name: 'App',
  components: {
    // Contacts,
  },
  data: () => ({
    drawer: false,
    group: null,
  }),
  methods: {},
  watch: {
    group () {
      this.drawer = false
    },
  }
};
</script>

<style>
  .mobile-preset {
    width: 100%;
    max-width: 700px;
    overflow: hidden;
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
</style>