import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import QuizView from '../views/QuizView.vue'
import ResultadoView from '../views/ResultadoView.vue'

const routes = [
  {
    path: '/',
    name: 'start',
    component: StartView
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: QuizView
  },
  {
    path: '/resultado',
    name: 'resultado',
    component: ResultadoView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
