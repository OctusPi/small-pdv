import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'vendas',
      component: () => import('../views/VendasView.vue')
    },
    {
      path: '/taras',
      name: 'taras',
      component: () => import('../views/TarasView.vue')
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: () => import('../views/ProdutosView.vue')
    },
    {
      path: '/relatorios',
      name: 'relatorios',
      component: () => import('../views/RelatoriosView.vue')
    },
    {
      path: '/ajustes',
      name: 'ajustes',
      component: () => import('../views/AjustesView.vue')
    }
  ]
})

export default router
