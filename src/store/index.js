import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    authKey: null,
    showAlert: false,
    alertMessage: '',
    alertType: ''
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
    }
  }
})
