import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue')
  },
  {
    path: '/app',
    name: 'App',
    beforeEnter: (to, from, next) => {
      if (store.getters.getUser == null) next({ path: '/' })
      else next()
    },
    component: () => import(/* webpackChunkName: "actual_app" */ '../views/App/Frame.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
