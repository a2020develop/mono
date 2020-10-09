<template>
  <v-app>
    <v-navigation-drawer app>
      <!-- -->
    </v-navigation-drawer>

    <v-app-bar app flat white>
      <v-container class="mobile-preset">
        <!-- -->
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="mobile-preset">
        <div style="display:none">
          <Contacts></Contacts>
        </div>
        <!-- <router-view></router-view> -->
      </v-container>
    </v-main>

    <v-footer app>
      <v-container class="mobile-preset">
        <!-- -->
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import Contacts from './components/Contacts'

export default {
  name: 'App',
  components: {
    Contacts
  },
  data: () => ({
  }),
  methods: {}
};
</script>

<style>
  .mobile-preset {
    max-width: 700px;
  }
</style>