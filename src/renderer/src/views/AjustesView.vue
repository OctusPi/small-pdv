<script setup>
    import { ref } from 'vue';
    import Ipc from '../services/ipc'
    import store from './../stores/local';
    import masks from './../utils/masks'
    import forms from './../services/forms'
    import notifys from '@renderer/utils/notifys'
    import HeaderMain from '../components/HeaderMain.vue';

    const emit  = defineEmits(['callAlert'])
    const ipc   = new Ipc()
    const admin = ref(store.getAdmin())
    const page  = ref({
        data:{
            company: admin.value.company,
            address: admin.value.address,
            phone: admin.value.phone
        },
        uploads:{},
        rules:{
            fields:{
                company: 'required',
			    address: 'required',
			    phone: 'required',
            },
            valids:{}
        }
    })

    function saveSetup() {
        const validation = forms.checkform(page.value.data, page.value.rules);
        if (!validation.isvalid) {
            emit('callAlert', notifys.warning(validation.message))
            return
        }

        ipc.request('setup_conf', {action: 'Setting.update', data: {values:{...page.value.data}, where:{token:admin.value.token}}}, (data) => {
            if(data){
                emit('callAlert', notifys.success('Dados salvos, feche o sistema e abra novamente para validar as alterações.'))
            }else{
                emit('callAlert', notifys.warning('Falha ao salvar dados!'))
            }
        })
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
    <main class="container-main">
        <HeaderMain :header="{icon:'bi-gear', title:'Ajustes'}"
        @callAlert="(data) => { emit('callAlert', data) }" />

        <div class="section-main d-md-flex justify-content-between">
            
            <div class="ioview m-2">
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

                    <footer class="mt-4">
                        <button type="submit" class="btn btn-lg btn-success">
                            <i class="bi bi-check-circle"></i> Salvar
                        </button>
                    </footer>
                </form>
            </div>

            <div class="preview m-2 text-center">
                <img class="logomarca" :src="`data:image/png;base64,${admin.logomarca}`">
                <h1 class="fs-5 fw-bold mt-2">{{ admin.company }}</h1>
                <p class="m-0 p-0">{{ admin.phone }}</p>
                <p class="m-0 p-0">{{ admin.address }}</p>
                
                <div class="token text-start mt-4">
                    <p class="p-0 m-0 fw-bold">Token de Segurança</p>
                    {{ admin.token }}
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>

.company-pic {
    width: 140px;
	height: 140px;
    padding: 10px;
    margin: 0 auto;
	background-color: var(--color-fundo);
	border-radius: 10px;
	border: 2px dashed var(--color-shadow);
	position: relative;
    background-color: var(--color-input-border);
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

</style>