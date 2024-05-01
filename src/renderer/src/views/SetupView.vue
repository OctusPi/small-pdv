<script setup>
import { ref } from 'vue'
import Ipc from '../services/ipc'
import masks from "@renderer/utils/masks"
import forms from '@renderer/services/forms'
import notifys from '@renderer/utils/notifys'

const ipc  = new Ipc()
const emit = defineEmits(['callAlert'])
const page = ref({
	data: {},
	uploads: {},
	rules: {
		fields: {
			company: 'required',
			address: 'required',
			phone: 'required',
			adminpass: 'required'
		},
		valids: {}
	}
})

function saveSetup() {
	const validation = forms.checkform(page.value.data, page.value.rules);
	if (!validation.isvalid) {
		emit('callAlert', notifys.warning(validation.message))
		return
	}

	ipc.request('setup_conf', {action: 'Setting.save', data: {...page.value.data}})
}

function handleFile(event) {
	const file = event.target.files[0]
	if (file) {

		const reader  = new FileReader()
		reader.readAsDataURL(file)
		reader.onloadend = () =>{
			page.value.data.logomarca = reader.result.replace(/^data:image\/[a-z]+;base64,/, "")
		}
		page.value.uploads.url = file.path
	}
}

</script>

<template>
	<main class="cotainer-setup d-flex justify-content-center align-items-center">
		<section class="box box-setup p-4 m-4">
			<header class="text-center">
				<img src="./../assets/icon.png" width="80" />
				<h1 class="fw-bold fs-5">Bem Vindo ao SmallPDVF</h1>
				<p class="small text-secondary mb-4">
					Agora faremos a configuração inicial para utilização do sistema.
				</p>
			</header>

			<div class="company-pic text-center mb-4 d-flex align-items-center justify-content-center">
				<img v-if="page.uploads.url" :src="page.uploads.url" class="img-logo">
				<span v-else class="small text-secondary d-block">Selecionar logomarca</span>

				<input @change="handleFile" type="file" name="pic" class="company-pic-input" required />
			</div>
			<form class="form-row g-3 mb-3" @submit.prevent="saveSetup">
				<div class="col-12">
					<label for="company" class="form-label text-start">Nome da Empresa</label>
					<input id="company" v-model="page.data.company" type="text"
						:class="{ 'form-control-alert': page.rules.valids.company }" class="form-control"
						placeholder="Digite o nome da sua Empresa" />
				</div>
				<div class="col-12">
					<label for="address" class="form-label text-start">Endereço</label>
					<input type="text" class="form-control" id="address" placeholder="Logradouro, n - Bairro, Cidade"
						v-model="page.data.address" :class="{ 'form-control-alert': page.rules.valids.address }" />
				</div>
				<div class="col-12">
					<label for="phone" class="form-label text-start">Telefone</label>
					<input type="text" class="form-control" id="phone" placeholder="(00)9.0000-0000"
						v-maska:[masks.maskphone] v-model="page.data.phone"
						:class="{ 'form-control-alert': page.rules.valids.phone }" />
				</div>
				<div class="col-12">
					<label for="adminpass" class="form-label text-start">Senha Administrador</label>
					<input type="password" class="form-control" id="adminpass" v-model="page.data.adminpass"
						:class="{ 'form-control-alert': page.rules.valids.adminpass }" />
				</div>

				<footer class="text-center mt-4">
					<button type="submit" class="btn btn-setup">
						<i class="bi bi-arrow-right"></i>
					</button>
				</footer>
			</form>
		</section>
	</main>
</template>

<style scoped>
.cotainer-setup {
	width: 100%;
}

.box-setup {
	width: 400px;
}

.company-pic {
	height: 140px;
	background-color: var(--color-fundo);
	border-radius: 10px;
	border: 2px dashed var(--color-input-border);
	position: relative;
}

.img-logo {
	height: 140px;
	border-radius: 10px;
}

.company-pic-input {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
	cursor: pointer;
	opacity: 0;
}

.btn-setup {
	border-radius: 50%;
	width: 50px;
	height: 50px;
	background-color: var(--color-base);
	color: white;
}

.form-control {
	font-size: 1rem;
}
</style>
