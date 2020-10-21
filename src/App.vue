<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src='./assets/calendar.png'
          transition="scale-transition"
          width="40"
        />

        <v-toolbar-title class="text-h3">Event planner</v-toolbar-title>

      </div>

    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>

    <v-alert v-if="alert[1]" :type="alert[2]" class="mx-auto" min-width="400" elevation="10" prominent>
      {{alert[0]}}
    </v-alert>
  </v-app>
</template>

<script>
import store from './store/index'

export default {
  name: 'App',
  computed: {
    alert () {
      return store.getters.getAlert
    }
  }
}
</script>
