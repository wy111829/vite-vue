import { createRouter, createWebHistory } from 'vue-router'

const history = createWebHistory()
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/index.vue')
  }
]
const router = createRouter({
  history,
  routes
})
export default router
