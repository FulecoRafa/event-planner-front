import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const months = ['0', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parseDate (date) {
  date = new Date(date)
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

    events: [],

    invites: []
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
        invite.start = parseDate(invite.event.startStamp)
        invite.end = parseDate(invite.event.endStamp)
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
      }, 5000)
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
              .then(async () => {
                await dispatch('fetchEvents')
                await dispatch('fetchInvites')
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

    fetchEvents ({ state, commit }) {
      return new Promise((resolve, reject) => {
        axios.get('http://localhost:9000/event', { headers: { auth: state.authKey } })
          .then(response => {
            commit('setEvents', response.data.data)
            resolve()
          })
          .catch(err => {
            console.log(err)
            reject(err.response.data.text)
          })
      })
    },
    addEvent ({ state, dispatch }, event) {
      return new Promise((resolve, reject) => {
        axios.post('http://localhost:9000/event', event, { headers: { auth: state.authKey } })
          .then(response => {
            dispatch('confirm', response.data.text)
            dispatch('fetchEvents')
            resolve()
          })
          .catch(err => {
            dispatch('alert', err.response.data.text)
            reject(err.response.data.text)
          })
      })
    },
    removeEvent ({ state, dispatch }, id) {
      return new Promise((resolve, reject) => {
        axios.delete(`http://localhost:9000/event/${id}`, { headers: { auth: state.authKey } })
          .then(response => {
            dispatch('confirm', response.data.text)
            dispatch('fetchEvents')
            resolve()
          })
          .catch(err => {
            dispatch('alert', err.response.data.text)
            reject(err.response.data.text)
          })
      })
    },
    editEvent ({ state, dispatch }, { eventData, id }) {
      console.log(id)
      return new Promise((resolve, reject) => {
        axios.put(`http://localhost:9000/event/${id}`, eventData, { headers: { auth: state.authKey } })
          .then(response => {
            dispatch('confirm', response.data.text)
            dispatch('fetchEvents')
            resolve()
          })
          .catch(err => {
            dispatch('alert', err.response.data.text)
            reject(err.response.data.text)
          })
      })
    },

    fetchInvites ({ state, commit, dispatch }) {
      return new Promise((resolve, reject) => {
        axios.get('http://localhost:9000/invite', { headers: { auth: state.authKey } })
          .then(response => {
            console.log(response.data.data)
            commit('setInvites', response.data.data)
            resolve()
            setTimeout(() => {
              dispatch('fetchInvites')
            }, 60000)
          })
          .catch(err => {
            console.log(err)
            reject(err.response.data.text)
          })
      })
    },
    sendInvite ({ state, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        axios.post('http://localhost:9000/invite', payload, { headers: { auth: state.authKey } })
          .then(response => {
            dispatch('confirm', response.data.text)
            dispatch('fetchInvites')
            resolve()
          })
          .catch(err => {
            dispatch('alert', err.response.data.text)
            reject(err.response.data.text)
          })
      })
    },
    acceptInvite ({ state, dispatch }, thisInvite) {
      return new Promise((resolve, reject) => {
        axios.post(`http://localhost:9000/invite/accept/${thisInvite.event._id}/${thisInvite._id}`, {}, { headers: { auth: state.authKey } })
          .then(response => {
            dispatch('confirm', response.data.text)
            dispatch('fetchInvites')
            dispatch('fetchEvents')
            resolve()
          })
          .catch(err => {
            dispatch('alert', err.response.data.text)
            reject(err.response.data.text)
          })
      })
    },
    declineInvite ({ state, dispatch }, thisInvite) {
      return new Promise((resolve, reject) => {
        axios.post(`http://localhost:9000/invite/decline/${thisInvite._id}`, {}, { headers: { auth: state.authKey } })
          .then(response => {
            dispatch('confirm', response.data.text)
            dispatch('fetchInvites')
            resolve()
          })
          .catch(err => {
            dispatch('alert', err.response.data.text)
            reject(err.response.data.text)
          })
      })
    },

    refresh ({ dispatch }) {
      return new Promise((resolve, reject) => {
        dispatch('fetchEvents')
          .then(() => {
            dispatch('fetchInvites')
              .then(() => {
                resolve()
              })
          })
      })
    }
  }
})
