<template>
  <div>
    <v-list max-width="600px" class="mx-auto px-3" elevation="3">
      <v-row class="mb-5 mr-1" align="center">
        <h2 class="ml-4">Your Events</h2>
        <v-spacer />
        <v-text-field v-model="searchPrompt" label="Search" append-icon="mdi-calendar-search"/>
        <v-spacer />
        <v-btn
          fab
          color="green"
          small
          @click="createEvent"
        >
          <v-icon small color="white">mdi-plus</v-icon>
        </v-btn>
      </v-row>
      <v-hover v-for="event in filteredEvents" :key="event.id" v-slot="{ hover }">
        <v-sheet :color="event.color" :elevation="hover ? 16 : 4" style="transition: 0.5s">
          <v-list-item link  @click="showEvent(event)" dark>
            <v-list-item-avatar>
              <v-icon large>mdi-bookmark</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{event.name}}
              </v-list-item-title>
              <v-list-item-action>
                <h4 class="mr-8">
                  {{event.start}}
                </h4>
                <h4 class="mr-8">
                  {{event.end}}
                </h4>
              </v-list-item-action>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="my-3"/>
        </v-sheet>
      </v-hover>
    </v-list>
    <EventForm :title="eventDialogTitle" :visible="eventDialogShow" :mode="mode" @exit="closeDialog"
    :editEvent="editEvent"/>
  </div>
</template>

<script>
import EventForm from './Forms/EventForm'

export default {
  components: {
    EventForm
  },
  data: () => ({
    eventDialogTitle: '',
    eventDialogShow: false,
    mode: '',
    editEvent: {},
    searchPrompt: ''
  }),
  computed: {
    events () {
      return this.$store.getters.getEvents
    },
    filteredEvents () {
      const regex = new RegExp(this.searchPrompt, 'gi')
      return this.events.filter(event => regex.test(event.name))
    }
  },
  methods: {
    showEvent (event) {
      this.mode = 'edit'
      this.editEvent = event
      this.eventDialogTitle = 'Edit Event'
      this.eventDialogShow = true
    },
    createEvent () {
      this.mode = 'create'
      this.eventDialogTitle = 'Create Event'
      this.eventDialogShow = true
    },
    closeDialog () {
      this.eventDialogShow = false
      this.dialogDate = ''
      this.editEvent = {}
    }
  }
}
</script>

<style>

</style>
