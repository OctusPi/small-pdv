<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const menu = ref([
  { icon: 'bi-receipt', title: 'Vendas', route: '/' },
  { icon: 'bi-bounding-box', title: 'Taras', route: '/taras' },
  { icon: 'bi-boxes', title: 'Produtos', route: '/produtos' },
  { icon: 'bi-journal-bookmark-fill', title: 'Relatórios', route: '/relatorios' },
  { icon: 'bi-gear', title: 'Ajustes', route: '/ajustes' }
])
</script>
<template>
  <nav class="main-nav">
    <div class="icon-system py-4">
      <img src="/src/assets/imgs/icon.png" />
      <h1>SmallPDV</h1>
      <p>Gestor de Vendas</p>
    </div>
    <div class="main-nav-itens">
      <ul>
        <li v-for="m in menu" :key="m.title">
          <RouterLink :to="m.route">
            <i class="bi" :class="m.icon"></i>
            <span>{{ m.title }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.main-nav {
  position: fixed;
  width: 120px;
  height: 100vh;
  overflow: auto;
  background-color: var(--color-base);
  color: white;
}

.icon-system {
  text-align: center;
}

.icon-system img {
  width: 50%;
}

.icon-system h1 {
  margin: 0;
  padding: 0;
  margin-top: 5px;
  font-size: 0.9rem;
  font-weight: bolder;
  font-family:
    monospace 'Courier New',
    Courier;
}

.icon-system p {
  font-size: 0.7rem;
  margin: 0;
  padding: 0;
}

.main-nav-itens ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.main-nav-itens li a {
  display: block;
  text-align: center;
  color: white;
  padding: 10px 0 10px 0;
  transition: 400ms;
}

.main-nav-itens li a:hover {
  background-color: var(--color-hover);
  transition: 400ms;
}

.main-nav-itens li a i {
  display: block;
  font-size: 2.2rem;
  margin: 0;
  padding: 0;
}
.main-nav-itens li a span {
  font-weight: bold;
  font-size: 0.9rem;
  margin: 0;
  padding: 0;
}
</style>
