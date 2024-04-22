<script setup>
import { onMounted } from 'vue'
// import { RouterView} from 'vue-router';
// import NavMain from './components/NavMain.vue';
// import ModalDelete from './components/ModalDelete.vue';
import SetupView from './views/SetupView.vue'

onMounted(() => {
  console.log()
})
</script>

<template>
  <div class="container-app">
    <!-- <ModalDelete />
    <NavMain />
    <RouterView /> -->
    <SetupView />
  </div>
</template>
