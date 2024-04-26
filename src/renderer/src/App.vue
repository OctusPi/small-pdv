<script setup>
import { onBeforeMount, ref } from 'vue'
import { RouterView} from 'vue-router';
import Controller from './services/controller'
import NavMain from './components/NavMain.vue';
import ModalDelete from './components/ModalDelete.vue';
import SetupView from './views/SetupView.vue'
import NotificationUI from './components/NotificationUI.vue';

const controller   = new Controller()
const setupView    = ref(false)
const datalist     = ref([])
const notification = ref({show: false, data:{type:'success', msg: ''}})
const remove       = ref({})

function callSetup(){
  controller.send('Setting.one', {})
}

onBeforeMount(() => {
  callSetup()
  controller.listen((data) => {
    setupView.value = data
  })
})

</script>

<template>

  <NotificationUI :alert="notification" />

  <div class="container-app">
    <template v-if="!setupView">
      <SetupView @callAlert="(data) => {notification = data}" />
    </template>
    <template v-else>
      <ModalDelete :params="remove" />
      <NavMain />
      <RouterView @callAlert="(data) => {notification = data}" />
    </template>
  </div>
</template>
