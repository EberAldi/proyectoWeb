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
        },
        {
          path: 'pago-qr',
          name: 'pago-qr',
          component: () => import('../modules/admin/pagos/views/PagoQR.vue'),
          meta: { title: 'Pago QR' },
        },
        {
          path:'productos',
          name:'productos',
          component : () => import('../modules/productos/views/productos.vue')
        },
        {
          path: 'sesiones',
          name: 'sesiones',
          component: () => import ('../modules/admin/consoles/components/SesionesActivas.vue')
        }
      ],
    },
  ],
})

export default router
