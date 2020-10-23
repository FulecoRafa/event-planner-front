<template>
  <v-dialog
    persistent
    v-model="visible"
    max-width="600px"
  >
    <v-card
      :loading="loading"
      :disabled="loading"
    >
      <v-card-title>Your information</v-card-title>
      <v-card-subtitle>{{user.id}}</v-card-subtitle>
      <v-card-text>
        <v-text-field
          readonly
          label="Username"
          :value="user.username"
          prepend-icon="mdi-account-circle"
        />
        <v-text-field
          label="New password"
          :type=" show2 ? 'text' : 'password'"
          v-model="newPasswd"
          prepend-icon="mdi-lock"
          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="show2 = !show2"
          :rules="pass_rules"
          required
          loading
          hint="Password strength"
          persistent-hint
        ><template v-slot:progress ><v-progress-linear
            :value="progress"
            :color="color"
            absolute
          ></v-progress-linear></template>
        </v-text-field>
        <v-text-field
          label="Repeat password"
          :type=" show3 ? 'text' : 'password'"
          v-model="rNewPasswd"
          prepend-icon="mdi-lock"
          :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="show3 = !show3"
          :error-messages="passwd_match || rNewPasswd === '' ? [] : ['Passwords must match']"
        />
        <v-divider />
        <v-text-field
          label="Password"
          :type=" show1 ? 'text' : 'password'"
          v-model="passwd"
          prepend-icon="mdi-lock"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="show1 = !show1"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
            color="blue darken-1"
            text
            @click="cancel"
          >
            Close
          </v-btn>
          <v-btn
            color="warning"
            text
            raised
            :disabled="!formValid"
            @click="changePasswd"
          >
            Change password
          </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean
  },
  data: () => ({
    loading: false,
    show1: false,
    show2: false,
    show3: false,
    passwd: '',
    newPasswd: '',
    rNewPasswd: '',
    pass_rules: [
      value => (value.length >= 6) ? true : 'Password must have at least 6 characters'
    ]
  }),
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    formValid () {
      return this.passwd !== '' && this.newPasswd !== '' && this.newPasswd === this.rNewPasswd && this.passwd_strength > 1
    },
    passwd_match () {
      return this.newPasswd === this.rNewPasswd
    },
    progress () {
      return this.passwd_strength / 4 * 100
    },
    color () {
      return ['error', 'error', 'yellow', 'green'][this.passwd_strength]
    },
    passwd_strength () {
      let points = 0
      if (this.newPasswd.match(/[A-Z]/g)) points++
      if (this.newPasswd.match(/[a-z]/g)) points++
      if (this.newPasswd.match(/\d/g)) points++
      if (this.newPasswd.match(/\W/g)) points++
      return points
    }
  },
  methods: {
    cancel () {
      this.$emit('exit')
    },
    changePasswd () {
      alert('edit')
    }
  }
}
</script>

<style>

</style>
