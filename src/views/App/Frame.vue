<template>
  <div class="actual_app">
    <Sidebar v-bind="user"/>
    <v-tabs
      v-model="tab"
      align-with-title
    >
      <v-tabs-slider />
      <v-tab>Calendar</v-tab>
      <v-tab>List</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <Calendar />
      </v-tab-item>
      <v-tab-item>
        <List />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import store from '../../store/index'

import Sidebar from '../../components/Sidebar'
import Calendar from '../../components/Calendar'
import List from '../../components/List'

export default {
  name: 'Frame',
  components: {
    Sidebar,
    Calendar,
    List
  },
  data: () => ({
    tab: 0
  }),
  computed: {
    user () {
      return store.getters.getUser
    },
    key () {
      return store.getters.getKey
    }
  }
}
</script>

<style>

</style>
