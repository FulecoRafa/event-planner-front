<template>
  <div class="actual_app">
    <Sidebar v-bind="user"/>
    <Calendar />
  </div>
</template>

<script>
import store from '../../store/index'

import Sidebar from '../../components/Sidebar'
import Calendar from '../../components/Calendar'

export default {
  name: 'Frame',
  components: {
    Sidebar,
    Calendar
  },
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
