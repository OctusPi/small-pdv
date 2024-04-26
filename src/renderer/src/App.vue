<script setup>
import { onBeforeMount, ref } from 'vue'
import { RouterView} from 'vue-router';
import Controller from './services/controller'
import NavMain from './components/NavMain.vue';
import ModalDelete from './components/ModalDelete.vue';
import SetupView from './views/SetupView.vue'

const controller = new Controller()

const setupView = ref(false)

function callSetup(){
  controller.send('Setting.one', {})
}

onBeforeMount(() => {
  callSetup()
  controller.listen((data) => {
    setupView.value = data
    console.log(typeof data)
    console.log(setupView.value)
  })

})

</script>

<template>
  <div class="container-app">
    <template v-if="!setupView">
      <SetupView />
    </template>
    <template v-else>
      <ModalDelete />
      <NavMain />
      <RouterView />
    </template>
  </div>
</template>
