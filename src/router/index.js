import { createRouter, createWebHashHistory } from 'vue-router'

const history = createWebHashHistory()
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
