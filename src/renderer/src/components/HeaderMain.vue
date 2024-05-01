<script setup>
import { onMounted, ref } from 'vue'
import dates from '../utils/dates';
import Ipc from '../services/ipc'
import store from '../stores/local'
import notifys from '../utils/notifys'

const ipc   = new Ipc()
const emit  = defineEmits(['callAlert'])
const props = defineProps({ header:Object })
const page  = ref({
    data:{},
    recover: false,
    isadmin: false,
    infos:{
        datenow: dates.dateNow(),
        hournow: dates.hourNow()
    }
})

function elevateAccess(){
    ipc.request('big_boss', {action: 'Setting.one', data: {adminpass: page.value.data.adminpass}}, (data) => {
        if(data !== null){
            store.setAdmin(data.dataValues)
            page.value.isadmin = true
        }else{
            emit('callAlert', notifys.warning('Senha do Administrador incorreta'))
        }
    })
}

function logOut(){
    store.clear()
    page.value.isadmin = false
}

function recoverPass(){
    ipc.request('setup_conf', {action: 'Setting.destroy', data:{token:page.value.data.tokenapp}}, (fail) => {
        if(fail){
            emit('callAlert', notifys.warning('Token de validação incorreto...'))
            return
        }
        logOut()
    })
}

onMounted(() => {
    setInterval(() => {
        page.value.infos.hournow = dates.hourNow()
    }, 1000);

    page.value.isadmin = store.getAdmin() ? true : false
})

</script>

<template>
    
    <div class="modal fade" id="passModal" tabindex="-1" aria-labelledby="passModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered show">
            <div class="modal-content">
                <div class="modal-header px-4 border-0">
                    <h1 class="modal-title fs-6" id="passModalLabel"><i class="bi bi-lock"></i> Acesso Administrativo</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form v-if="page.recover" @submit.prevent="recoverPass">
                    <div class="modal-body px-4">
                        <div class="text-center mb-2">
                            <i class="bi bi-braces fs-1"></i>
                            <p>Informe o token de configuração do App para recuperar sua senha de administrador!</p>
                            <p class="text-danger">Está ação irá remover as configurações inicial do sistema, sendo necessário informa-las novamente. Não se preocupe, nenhum outro dado será removido...</p>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <label for="tokenapp" class="form-label">Token App</label>
                            <a href="#" @click.prevent="page.recover = false">Tenho a Senha</a>
                        </div>
                        <input type="text" class="form-control" id="tokenapp" v-model="page.data.tokenapp">
                    </div>
                    <div class="modal-footer border-0 px-4 mb-3">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="bi bi-x-circle"></i> Cancelar</button>
                        <button type="submit" class="btn btn-success" data-bs-dismiss="modal"><i class="bi bi-check-circle"></i> Confirmar</button>
                    </div>
                </form>
                <form v-else @submit.prevent="elevateAccess">
                    <div class="modal-body px-4">
                        <div class="text-center mb-2">
                            <i class="bi bi-lock fs-1"></i>
                            <p>Desbloquear funcionalidades administrativas do Sistema. Registro e Gestão de Taras, Produtos e Emissão de Relatórios</p>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <label for="adminpass" class="form-label">Senha do Administrador</label>
                            <a href="#" @click.prevent="page.recover = true">Recuperar Senha</a>
                        </div>
                        <input type="password" class="form-control" id="adminpass" v-model="page.data.adminpass">
                    </div>
                    <div class="modal-footer border-0 px-4 mb-3">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="bi bi-x-circle"></i> Cancelar</button>
                        <button type="submit" class="btn btn-success" data-bs-dismiss="modal"><i class="bi bi-check-circle"></i> Confirmar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <header class="header-main d-flex justify-content-between align-items-center p-4">
        <h1><i class="bi" :class="props.header.icon"></i> {{ props.header.title }}</h1>
        <div class="header-main-info d-flex align-items-center">
            <div class="ms-4">
                <h2>{{ page.infos.hournow }}</h2>
                <p>{{ page.infos.datenow }}</p>
            </div>
            <div class="ms-4 d-flex align-items-center">
                <i class="bi bi-person me-2 fs-4"></i>
                <div>
                    <h2>{{ page.isadmin ? 'Administrador' : 'Vendedor' }}</h2>
                    <p>Perfil de Acesso</p>
                </div>
            </div>
            <div v-if="!page.isadmin" class="ms-4 d-flex align-items-center toggleadmin" data-bs-toggle="modal" data-bs-target="#passModal">
                <i class="bi bi-lock me-2 fs-4"></i>
                <div>
                    <h2>Admin</h2>
                    <p>Acesso administrador</p>
                </div>
            </div>
            <button v-else @click="logOut" type="button" class="btn btn-lg btn-outline-light ms-4"><i class="bi bi-door-open me-1"></i>Sair</button>
        </div>
    </header>
</template>

<style scoped>
    .header-main{
        width: calc(100% - 120px);
        position: fixed;
        z-index: 3000;
        color: white;
        background-color: var(--color-base);
    }

    .header-main h1{
        font-size: 2rem;
        margin: 0;
        padding: 0;
    }

    .header-main h1 i{
        font-size: 2rem;
    }

    .header-main-info h2{
        margin: 0;
        padding: 0;
    }

    .header-main-info p{
        margin: 0;
        padding: 0;
        font-size: small;
    }

    .toggleadmin{
        cursor: pointer;
    }
</style>