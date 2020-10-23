<template>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64"><v-toolbar dense flat>
          <v-btn
            icon
            class="ma-2"
            @click="$refs.calendar.prev()"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title v-if="ready">{{$refs.calendar.title}}</v-toolbar-title>
          <v-btn
            icon
            class="ma-2"
            @click="$refs.calendar.next()"
          >
            <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="day = ''"
          >
            Today
          </v-btn>
        </v-toolbar></v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            type="month"
            v-model="day"
            :events="events"
            :event-color="getEventColor"
            @click:event="showEvent"
            @click:date="createEvent"
          >

          </v-calendar>
        </v-sheet>
      </v-col>
      <EventForm :title="eventDialogTitle" :visible="eventDialogShow" :mode="mode" @exit="closeDialog"
      :date="dialogDate" :editEvent="editEvent"/>
  </v-row>
</template>

<script>
import EventForm from '../components/Forms/EventForm'

export default {
  components: {
    EventForm
  },
  data: () => ({
    day: '',
    eventDialogShow: false,
    eventDialogTitle: '',
    dialogDate: '',
    mode: '',
    editEvent: {},
    ready: false
  }),
  methods: {
    getEventColor (event) {
      return event.color
    },
    showEvent ({ event }) {
      this.mode = 'edit'
      this.editEvent = event
      console.log(event)
      this.eventDialogTitle = 'Edit Event'
      this.eventDialogShow = true
    },
    createEvent (e) {
      this.dialogDate = e.date
      this.mode = 'create'
      this.eventDialogTitle = 'Create Event'
      this.eventDialogShow = true
    },
    closeDialog () {
      this.eventDialogShow = false
      this.dialogDate = ''
      this.editEvent = {}
    }
  },
  computed: {
    events () {
      return this.$store.getters.getEvents
    }
  },
  mounted () {
    this.ready = true
  }
}
</script>

<style>

</style>
