<template>

  <v-card
  :loading="loading"
  class="mx-auto my-12"
  max-width="372"
  >
    <v-img
      height="200"
      width="500"
      src="../assets/meeting_edit.jpg"
    ></v-img>
    <v-card-title>Login</v-card-title>
    <v-card-text>
      <v-row>
        <v-icon>mdi-account-circle</v-icon>
        <v-text-field
          label="Username"
          class="mx-4"
          v-model="userData.username"
        ></v-text-field>
      </v-row>
      <v-row>
        <v-icon>mdi-lock</v-icon>
        <v-text-field
          label="Password"
          :type="show ? 'text' : 'password'"
          class="mx-4"
          v-model="userData.passwd"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="show = !show"
        ></v-text-field>
      </v-row>
      <v-card-actions>
        <v-btn
          :disabled="!validForm"
          color="primary"
        >Login</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          @click="goToRegister"
        >Register</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>

</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    loading: false,
    show: false,
    userData: {
      username: '',
      passwd: ''
    }
  }),
  computed: {
    validForm () {
      return this.$data.userData.username !== '' && this.$data.userData.passwd !== ''
    }
  },
  methods: {
    goToRegister () {
      this.$router.push({ path: '/register' })
    }
  }
}
</script>

<style>

</style>
