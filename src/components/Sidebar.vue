<template>
  <v-navigation-drawer
    v-model="drawer"
    permanent
    expand-on-hover
    bottom
    app
  >
    <v-list>
      <v-list-item class="px-2">
        <v-list-item-avatar
          class="justify-center"
        >
          <v-avatar
            color="primary"
            class="white--text"
          >
            {{user.username.toUpperCase()[0]}}
          </v-avatar>
        </v-list-item-avatar>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title text-h3">
            {{user.username}}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider/>
      <v-list-item link @click="userFormShow = !userFormShow">
        <v-icon>mdi-account-circle</v-icon>
        <v-list-item-title class="ml-5">Acount</v-list-item-title>
      </v-list-item>
      <v-list-item link>
        <v-badge
          :content="inv_num"
          :value="inv_num"
          color="primary"
          overlap
          bordered
        >
          <v-icon>mdi-email</v-icon>
        </v-badge>
        <v-list-item-title class="ml-5">Invitations</v-list-item-title>
      </v-list-item>
      <v-list-item link  @click="logout">
        <v-icon>mdi-exit-to-app</v-icon>
        <v-list-item-title class="ml-5">Log out</v-list-item-title>
      </v-list-item>
    </v-list>
    <UserForm :visible="userFormShow" @exit="userFormShow = false"/>
  </v-navigation-drawer>
</template>

<script>
import UserForm from '../components/Forms/UserForm'

export default {
  components: {
    UserForm
  },
  data: () => ({
    drawer: true,
    inv_num: 5,
    userFormShow: false
  }),
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    key () {
      return this.$store.getters.getKey
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
      this.$store.dispatch('confirm', 'Successfully logged out')
      this.$router.push('/')
    }
  }
}
</script>

<style>

</style>
