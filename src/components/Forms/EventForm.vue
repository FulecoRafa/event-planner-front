<template>
    <v-dialog
      v-model="visible"
      persistent
      max-width="600px"
    >
      <v-card :loading="loading" :disabled="loading">
        <v-card-title>
          <div>{{title}}</div>
          <v-spacer />
          <Invite  v-if="mode === 'edit'" :event="editEvent._id"/>
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="Event name"
            v-model="eventData.name"
          />

          <v-row>
            <v-col>
              <v-menu
                ref="menu1"
                v-model="startDateMenu"
                :nudge-right="40"
                :close-on-content-click="false"
                transition="scale-transition"
                max-width="290px"
                offset-y
                min-width="290px"
              >
                <template
                  v-slot:activator="{}"
                >
                  <v-text-field
                    label="Start Date"
                    readonly
                    prepend-icon="mdi-calendar"
                    :value="startDateString"
                    @click:prepend="startDateMenu = true"
                  />
                </template>
                <v-date-picker
                  v-model="startDate"
                  no-title
                  scrollable
                  :max="endDate"
                  @input="startDateMenu = false"
                >
                </v-date-picker>
              </v-menu>
              <v-menu
                ref="menu11"
                v-model="startTimeMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{on}">
                  <v-text-field
                    v-model="startTime"
                    label="Start time"
                    :disabled="!startDate"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-on="on"
                    @click:prepend="startTimeMenu = true"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="startTimeMenu"
                  v-model="startTime"
                  format="24hr"
                  full-width
                  :max="startDate == endDate ? endTime : null"
                  @click:minute="startTimeMenu = false"
                ></v-time-picker>
              </v-menu>
            </v-col>

            <v-col
              class="text-h2"
            >
              UNTIL
            </v-col>

            <v-col>
              <v-menu
              ref="menu2"
                v-model="endDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                max-width="290px"
                offset-y
                min-width="290px"
              >
                <template
                  v-slot:activator="{on}"
                >
                  <v-text-field
                    label="End Date"
                    readonly
                    prepend-icon="mdi-calendar"
                    :value="endDateString"
                    v-on="on"
                    @click:prepend="endDateMenu = true"
                  />
                </template>
                <v-date-picker
                  v-model="endDate"
                  no-title
                  scrollable
                  :min="startDate"
                  @input="endDateMenu = false"
                >
                </v-date-picker>
              </v-menu>
              <v-menu
                ref="menu12"
                v-model="endTimeMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{on}">
                  <v-text-field
                    :disabled="!endDate"
                    v-model="endTime"
                    label="End time"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-on="on"
                    @click:prepend="endTimeMenu = true"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="endTimeMenu"
                  v-model="endTime"
                  format="24hr"
                  full-width
                  :min="startDate == endDate ? startTime : null"
                  @click:minute="endTimeMenu = false"
                ></v-time-picker>
              </v-menu>
            </v-col>

          </v-row>
          <v-row align="center">
            <h2>Color:</h2>
            <v-spacer />
            <v-btn-toggle
              v-model="colorSelect"
            >
              <v-btn>
                <v-icon color="blue">mdi-brush</v-icon>
              </v-btn>
              <v-btn>
                <v-icon color="orange">mdi-brush</v-icon>
              </v-btn>
              <v-btn>
                <v-icon color="green">mdi-brush</v-icon>
              </v-btn>
              <v-btn>
                <v-icon color="pink">mdi-brush</v-icon>
              </v-btn>
              <v-btn>
                <v-icon color="red">mdi-brush</v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-spacer />
            <strong class="text-h6">{{eventData.color}}</strong>
          </v-row>
          <v-divider class="my-8" v-if="errorMsg"/>
          <h3 style="color:red" v-if="errorMsg">{{errorMsg}}</h3>

        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red darken-1"
            text
            @click="remove"
            v-if="mode == 'edit'"
          >
            Delete Event
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="cancel"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="!formIsValid"
            @click="save"
          >
            {{!formIsValid ? "Provide all information" : "Save"}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import Invite from '../Invite'

export default {
  components: {
    Invite
  },
  props: {
    title: String,
    date: String,
    visible: Boolean,
    mode: String,
    editEvent: Object
  },
  data: () => ({
    eventData: {
      name: '',
      startStamp: null,
      endStamp: null,
      color: ''
    },
    startDate: null,
    endDate: null,
    startDateMenu: false,
    endDateMenu: false,
    startTime: '',
    endTime: '',
    startTimeMenu: false,
    endTimeMenu: false,
    colorSelect: null,
    colors: [
      'blue',
      'orange',
      'green',
      'pink',
      'red'
    ],
    loading: false,
    setup: false,
    errorMsg: ''
  }),
  computed: {
    startDateString () {
      if (this.startDate === null) return ''
      const date = this.startDate
      const parsedDate = date.split('-')
      return `${parsedDate[2]}/${parsedDate[1]}/${parsedDate[0]}`
    },
    endDateString () {
      if (this.endDate === null) return ''
      const date = this.endDate
      const parsedDate = date.split('-')
      return `${parsedDate[2]}/${parsedDate[1]}/${parsedDate[0]}`
    },
    formIsValid () {
      return this.eventData.name !== '' && this.startOk && this.endOk && this.eventData.color !== ''
    },
    startOk () {
      return this.startDate && this.startTime
    },
    endOk () {
      return this.endDate && this.endTime
    }
  },
  methods: {
    reset () {
      this.startDateMenu = false
      this.endDateMenu = false
      this.startTime = ''
      this.endTime = ''
      this.startTimeMenu = false
      this.endTimeMenu = false
      this.startDate = null
      this.endDate = null
      this.loading = false
      this.eventData = {
        name: '',
        startStamp: null,
        endStamp: null,
        color: ''
      }
    },
    remove () {
      this.loading = true
      this.errorMsg = ''
      this.$store.dispatch('removeEvent', this.editEvent._id)
        .then(() => {
          this.reset()
          this.$emit('exit')
        })
        .catch(err => {
          this.errorMsg = err
        })
      this.loading = false
    },
    cancel () {
      this.reset()
      this.$emit('exit')
    },
    save () {
      this.loading = true
      this.errorMsg = ''
      if (this.mode === 'create') {
        this.$store.dispatch('addEvent', this.eventData)
          .then(() => {
            this.reset()
            this.$emit('exit')
          })
          .catch(err => {
            this.errorMsg = err
          })
      }
      if (this.mode === 'edit') {
        this.$store.dispatch('editEvent', { eventData: this.eventData, id: this.editEvent._id })
          .then(() => {
            this.reset()
            this.$emit('exit')
          })
          .catch(err => {
            this.errorMsg = err
          })
      }
      this.loading = false
    }
  },
  watch: {
    startOk () {
      if (this.startOk) {
        this.eventData.startStamp = new Date(`${this.startDate}T${this.startTime}:00`)
      }
    },
    endOk () {
      if (this.endOk) {
        this.eventData.endStamp = new Date(`${this.endDate}T${this.endTime}:00`)
      }
    },
    startDate () {
      if (!this.setup) this.startTime = null
    },
    endDate () {
      if (this.setup) this.setup = false
      else this.endTime = null
    },
    colorSelect () {
      this.eventData.color = this.colors[this.colorSelect]
    },
    visible () {
      if (this.visible) {
        this.setup = true
        if (this.mode === 'create') {
          this.eventData.start = this.date || ''
          this.startDate = this.date || ''
        }
        if (this.mode === 'edit') {
          this.eventData = this.editEvent
          const startArr = this.editEvent.start.split(' ')
          const endArr = this.editEvent.end.split(' ')
          this.startDate = startArr[0]
          this.endDate = endArr[0]
          this.startTime = startArr[1]
          this.endTime = endArr[1]
          this.colorSelect = this.colors.indexOf(this.editEvent.color)
          console.log(this.endTime)
        }
      }
    }
  }
}
</script>

<style>

</style>
