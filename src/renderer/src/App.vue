<script setup>
import { onBeforeMount, ref } from 'vue'
import { RouterView } from 'vue-router';
import Controller from './services/controller'
import NavMain from './components/NavMain.vue';
import ModalDelete from './components/ModalDelete.vue';
import SetupView from './views/SetupView.vue'
import NotificationUI from './components/NotificationUI.vue';

const controller = new Controller()
const setupView = ref(true)
const datalist = ref([])
const notification = ref({ show: false, data: { type: 'success', msg: '' } })
const remove = ref({})

onBeforeMount(() => {
	controller.send('Setting.setup_check', {})
	controller.listen((data) => { 
		if(data.setup){
			setupView.value = data.setup.value
		}
	 })
})

</script>

<template>

	<NotificationUI :alert="notification" />

	<div class="container-app">
		<template v-if="!setupView">
			<SetupView @callAlert="(data) => { notification = data }" />
		</template>

		<template v-else>
			<ModalDelete :params="remove" />
			<NavMain />
			<RouterView @callAlert="(data) => { notification = data }" />
		</template>
	</div>
</template>
