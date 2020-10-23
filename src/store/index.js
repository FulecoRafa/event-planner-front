import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const months = ['0', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parseDate (date) {
  let sDate = date.toString()
  sDate = sDate.split(' ')
  return `${sDate[3]}-${months.indexOf(sDate[1])}-${sDate[2]} ${sDate[4].slice(0, 5)}`
}

export default new Vuex.Store({
  state: {
    user: null,
    authKey: null,

    showAlert: false,
    alertMessage: '',
    alertType: '',

    events: [
      {
        name: 'First',
        startStamp: new Date('2020-10-22T08:00Z'),
        endStamp: new Date('2020-10-28T08:00Z'),
        color: 'blue',
        id: 1
      },
      {
        name: 'Second',
        startStamp: new Date('2020-10-28T08:00Z'),
        endStamp: new Date('2020-10-28T10:00Z'),
        color: 'orange',
        id: 2
      },
      {
        name: 'Third',
        startStamp: new Date('2020-10-29T08:00Z'),
        endStamp: new Date('2020-11-01T08:00Z'),
        color: 'green',
        id: 3
      }
    ],

    invites: [
      {
        name: 'Inv1',
        startStamp: new Date('2020-10-22T08:00Z'),
        endStamp: new Date('2020-10-28T08:00Z'),
        color: 'blue',
        id: 1
      },
      {
        name: 'Inv2',
        startStamp: new Date('2020-10-28T08:00Z'),
        endStamp: new Date('2020-10-28T10:00Z'),
        color: 'orange',
        id: 2
      },
      {
        name: 'Inv3',
        startStamp: new Date('2020-10-29T08:00Z'),
        endStamp: new Date('2020-11-01T08:00Z'),
        color: 'green',
        id: 3
      }
    ]
  },
  getters: {
    getKey: (state) => {
      return state.authKey
    },
    getUser: (state) => {
      return state.user
    },
    getAlert: (state) => {
      return [state.alertMessage, state.showAlert, state.alertType]
    },

    getEvents: (state) => {
      return state.events.map(event => {
        event.start = parseDate(event.startStamp)
        event.end = parseDate(event.endStamp)
        return event
      })
    },

    getInvites: (state) => {
      return state.invites.map(invite => {
        invite.start = parseDate(invite.startStamp)
        invite.end = parseDate(invite.endStamp)
        return invite
      })
    },
    getInviteNum: (state) => {
      return state.invites.length
    }
  },
  mutations: {
    set_user (state, obj) {
      state.user = obj.user
    },
    set_key (state, payload) {
      state.authKey = payload.key
    },
    set_alert (state, message) {
      state.alertMessage = message
      state.alertType = 'error'
      state.showAlert = true
      setTimeout(() => {
        state.showAlert = false
      }, 8000)
    },
    set_confirm (state, message) {
      state.alertMessage = message
      state.alertType = 'success'
      state.showAlert = true
      setTimeout(() => {
        state.showAlert = false
      }, 5000)
    },
    clear_user (state) {
      state.user = null
    },

    setEvents (state, events) {
      state.events = events
    },

    setInvites (state, newInvites) {
      state.invites = newInvites
    }
  },
  actions: {
    authUser ({ commit, state }) {
      return new Promise((resolve, reject) => {
        axios.post('http://localhost:9000/user/auth', {}, { headers: { auth: state.authKey } })
          .then(response => {
            commit('set_user', { user: response.data.data })
            resolve()
          })
          .catch(err => {
            console.log(err.response.data)
            reject(err.response.data)
          })
      })
    },
    login ({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        axios.post('http://localhost:9000/user/login', payload)
          .then(response => {
            commit('set_key', { key: response.data.auth })
            dispatch('authUser')
              .then(() => {
                resolve()
              })
              .catch(err => {
                console.log(err)
                reject(err)
              })
          })
          .catch(err => {
            reject(err.response.data.text)
          })
      })
    },
    logout ({ commit }) {
      commit('clear_user')
    },
    register (context, payload) {
      return new Promise((resolve, reject) => {
        axios.post('http://localhost:9000/user/register', payload)
          .then(response => {
            resolve()
          })
          .catch(err => {
            reject(err.response.data.text)
          })
      })
    },
    alert ({ commit }, message) {
      commit('set_alert', message)
    },
    confirm ({ commit }, message) {
      commit('set_confirm', message)
    },

    addEvent ({ state, commit }, event) {
      const oldEvents = state.events
      const newEvents = [...oldEvents, event]
      commit('setEvents', newEvents)
    },
    removeEvent ({ state, commit }, id) {
      const oldEvents = state.events
      const newEvents = oldEvents.filter(event => event.id !== id)
      commit('setEvents', newEvents)
    },
    editEvent ({ state, commit }, { eventData, id }) {
      const oldEvents = state.events
      const newEvents = oldEvents.filter(event => event.id !== id)
      commit('setEvents', [...newEvents, eventData])
    },

    acceptInvite ({ state, commit }, thisInvite) {
      const oldInvites = state.invites
      const newInvites = oldInvites.filter(invite => invite.id !== thisInvite.id)
      commit('setInvites', newInvites)
    },
    declineInvite ({ state, commit }, thisInvite) {
      const oldInvites = state.invites
      const newInvites = oldInvites.filter(invite => invite.id !== thisInvite.id)
      commit('setInvites', newInvites)
    }
  }
})
