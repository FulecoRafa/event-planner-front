<template>
  <v-menu
    v-model="menu"
    offset-y
    bottom
    :close-on-content-click="false"
    :nudge-width="200"
    class="popup"
  >
    <template v-slot:activator="{on}">
      <v-btn
        color="blue lighten-2"
        v-on="on"
      >
      <v-icon left>mdi-share-variant</v-icon>
      Invite
      </v-btn>
    </template>
    <v-sheet>
      <v-row class="mx-4" align="center">
        <v-text-field
          label="User to invite"
        />
        <v-btn
          color="blue lighten-2"
          class="ml-8"
          @click="send"
        >
        <v-icon left>mdi-send</v-icon>
        Send
        </v-btn>
      </v-row>
    </v-sheet>
  </v-menu>
</template>

<script>
export default {
  data: () => ({
    menu: false
  }),
  methods: {
    send () {
      this.menu = false
    }
  }
}
</script>

<style scoped>
.popup {
  background-color: #ffffff;
}
</style>
