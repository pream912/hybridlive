import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Client from '../views/Client.vue'
import Main from '../views/Main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/main',
    component: Main
  },
  {
    path: '/user/:id',
    component: Client
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
