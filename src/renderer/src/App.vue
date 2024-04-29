<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import { RouterView } from 'vue-router';
import Ipc from './services/ipc'
import NavMain from './components/NavMain.vue';
import ModalDelete from './components/ModalDelete.vue';
import SetupView from './views/SetupView.vue'
import NotificationUI from './components/NotificationUI.vue';

const ipc = new Ipc()
const setupView = ref(true)
const datalist = ref([])
const notification = ref({ show: false, data: { type: 'success', msg: '' } })
const remove = ref({})

onBeforeMount(() => {
	ipc.request('setup_check', {action: 'Setting.one', data: {}}, (data) => {
		setupView.value = data
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
