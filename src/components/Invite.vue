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
          v-model="username"
          :error-messages="errorMsg"
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
  props: ['event'],
  data: () => ({
    menu: false,
    username: '',
    apiError: ''
  }),
  computed: {
    errorMsg () {
      return this.username.length < 1 ? [this.apiError, 'Must provide username'] : [this.apiError]
    }
  },
  methods: {
    send () {
      this.$store.dispatch('sendInvite', {
        event: this.event,
        username: this.username
      })
        .then(() => {
          this.menu = false
        })
        .catch(err => {
          this.apiError = err
        })
    }
  }
}
</script>

<style scoped>
.popup {
  background-color: #ffffff;
}
</style>
