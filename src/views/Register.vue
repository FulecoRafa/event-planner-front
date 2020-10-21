<template>

  <v-card
  :loading="loading"
  class="mx-auto my-12"
  max-width="372"
  >
    <v-img
      height="200"
      width="500"
      src="../assets/paperwork.jpg"
    ></v-img>
    <v-card-title>Register</v-card-title>
    <v-card-text>
      <v-row>
        <v-icon>mdi-account-circle</v-icon>
        <v-text-field
          label="Username"
          class="mx-4"
          v-model="userData.username"
          required
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
          :rules="pass_rules"
          required
          loading
          hint="Password strength"
          persistent-hint
        >
          <template v-slot:progress ><v-progress-linear
            :value="progress"
            :color="color"
            absolute
          ></v-progress-linear></template>
        </v-text-field>
      </v-row>
      <v-row>
        <v-icon>mdi-lock</v-icon>
        <v-text-field
          label="Repeat password"
          :type="show ? 'text' : 'password'"
          class="mx-4"
          v-model="userData.r_passwd"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="show = !show"
          required
          :error-messages="passwd_match || userData.r_passwd === '' ? [] : ['Passwords must match']"
        >
        </v-text-field>
      </v-row>
      <v-card-actions>
        <v-btn
          :disabled="!validForm"
          color="primary"
          @click="register"
        >Register</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          @click="goToLogin"
        >Login</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>

</template>

<script>
export default {
  name: 'Register',
  data: () => ({
    loading: false,
    show: false,
    userData: {
      username: '',
      passwd: '',
      r_passwd: ''
    },
    pass_rules: [
      value => (value.length >= 6) ? true : 'Password must have at least 6 characters'
    ]
  }),
  computed: {
    validForm () {
      return this.$data.userData.username !== '' && this.$data.userData.passwd !== '' && this.$data.userData.r_passwd === this.$data.userData.passwd && this.passwd_strength() > 1
    },
    passwd_match () {
      return this.$data.userData.r_passwd === this.$data.userData.passwd
    },
    progress () {
      return this.passwd_strength() / 4 * 100
    },
    color () {
      return ['error', 'error', 'yellow', 'green'][this.passwd_strength()]
    }
  },
  methods: {
    goToLogin () {
      this.$router.push({ path: '/' })
    },
    passwd_strength () {
      let points = 0
      if (this.userData.passwd.match(/[A-Z]/g)) points++
      if (this.userData.passwd.match(/[a-z]/g)) points++
      if (this.userData.passwd.match(/\d/g)) points++
      if (this.userData.passwd.match(/\W/g)) points++
      return points
    },
    register () {
      this.$store.dispatch('register', this.userData)
        .then(() => {
          this.$store.dispatch('confirm', 'Registering was successfull')
          this.$router.push('/')
        })
        .catch(err => {
          this.$store.dispatch('alert', err)
        })
    }
  }
}
</script>

<style>

</style>
