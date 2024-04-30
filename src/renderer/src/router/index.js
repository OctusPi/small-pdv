import { createRouter, createWebHistory } from 'vue-router'
import store from '../stores/local'

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
      meta: {auth: true},
      component: () => import('../views/TarasView.vue')
    },
    {
      path: '/produtos',
      name: 'produtos',
      meta: {auth: true},
      component: () => import('../views/ProdutosView.vue')
    },
    {
      path: '/relatorios',
      name: 'relatorios',
      meta: {auth: true},
      component: () => import('../views/RelatoriosView.vue')
    },
    {
      path: '/ajustes',
      name: 'ajustes',
      meta: {auth: true},
      component: () => import('../views/AjustesView.vue')
    },
    {
      path: '/forbbiden',
      name: 'forbbiden',
      component: () => import('../views/ForbbidenView.vue')
    }
  ]
})

router.beforeEach(async (to) => {
	if (to.meta?.auth) {
    const isadmin = store.getAdmin()
    if(!isadmin){
      return '/forbbiden'
    }
	}
})

export default router
