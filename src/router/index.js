import { createRouter, createWebHistory } from 'vue-router'
import LayoutMain from '@/layouts/adminLayout.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: () => import('../modules/login/views/login.vue') },

    {
      path: '/',
      component: LayoutMain,
      children: [
        { path: '', redirect: '/dashboard' },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/modules/admin/consoles/views/dashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'consolas',
          name: 'consolas',
          component: () => import('.././modules/admin/consoles/views/consolasView.vue'),
          meta: { title: 'Consolas' },
        },
        {
          path: 'games',
          name: 'games',
          component : () => import('../modules/admin/games/views/dashboardGames.vue'),
          meta: {title: 'games'}
        }
      ],
    },
  ],
})

export default router
