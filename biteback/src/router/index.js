import { createRouter, createWebHistory } from 'vue-router'
import { state } from '../store'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      beforeEnter: (to, from, next) => {
        // ensure that state is not null
        state.mode ? next() : next({ name: 'register' })
      },
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      beforeEnter: (to, from, next) => {
        // ensure that state is not null
        !state.mode ? next() : next({ name: 'home' })
      },
      component: RegisterView
    }
  ]
})

export default router
