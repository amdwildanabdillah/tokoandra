import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // Mengarah ke file Home.vue yang baru kita buat di folder store
      component: () => import('@/views/store/Home.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      // Mengarah ke file admin (bisa dikosongin dulu file-nya atau buat base component-nya)
      component: () => import('@/views/admin/Dashboard.vue')
    }
  ]
})

export default router