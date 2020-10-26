<template>
  <v-navigation-drawer
    v-model="drawer"
    permanent
    expand-on-hover
    bottom
    app
    width="300"
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
      <v-list-group
        v-model="invitesOpen"
        no-action
        v-if="inviteNum"
      >
        <template v-slot:prependIcon>
            <v-badge
              :content="inviteNum"
              :value="inviteNum"
              color="primary"
              overlap
              bordered
            >
              <v-icon>mdi-email</v-icon>
            </v-badge>
        </template>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Invitations</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="invite in invites"
          :key="invite.id"
        >
          <v-list-item-content>
            <v-list-item-title style="white-space: normal">{{invite.sender.username}} has invited you to {{invite.event.name}}</v-list-item-title>
            <v-list-item-subtitle>
              {{invite.start}}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{invite.end}}
            </v-list-item-subtitle>
            <v-list-item-action>
              <v-row>
                <v-btn color="success" small @click="acceptInv(invite)">Accept</v-btn>
                <v-btn class="ml-3" color="error" small @click="declineInv(invite)">Decline</v-btn>
              </v-row>
            </v-list-item-action>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-list-item v-else link @click="noInv">
        <v-icon>mdi-email</v-icon>
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
    userFormShow: false,
    invitesOpen: false
  }),
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    key () {
      return this.$store.getters.getKey
    },
    invites () {
      return this.$store.getters.getInvites
    },
    inviteNum () {
      return this.$store.getters.getInviteNum
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
      this.$store.dispatch('confirm', 'Successfully logged out')
      this.$router.push('/')
    },
    acceptInv (invite) {
      this.$store.dispatch('acceptInvite', invite)
    },
    declineInv (invite) {
      this.$store.dispatch('declineInvite', invite)
    },
    noInv () {
      this.$store.dispatch('alert', 'You have no invites')
    }
  }
}
</script>

<style>

</style>
