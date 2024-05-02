<script setup>

import Ipc from '../services/ipc'
import notifys from '@renderer/utils/notifys'

const ipc = new Ipc()

const emit = defineEmits(['callAlert', 'callRemove'])
const props = defineProps({
    params:{type: Object, required:true}
})

function deleteRegister(){
    const action = {action:props.params.action, data:{...props.params.data}}

    ipc.request('query_db', action, (success) => {
        
        if(!success){
            emit('callAlert', notifys.warning('Falha ao excluir registro...'))
            return
        }

        emit('callAlert', notifys.success('Registro excluído com sucesso...'))
        emit('callRemove', action.data.id)
        
    })
}
</script>

<template>
    <div class="modal fade" id="modalDelete" tabindex="-1" aria-labelledby="modalDeleteLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header px-4 border-0">
                    <h1 class="modal-title fs-6" id="passModalLabel"><i class="bi bi-trash"></i> Confirmação de Exclusão</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="deleteRegister">
                    <div class="modal-body px-4 text-center">
                        <i class="bi bi-trash fs-1 text-danger"></i>
                        <p class="text-danger">O Item será apagado permanentemente e não poderá ser restaurado, deseja continuar?</p>
                    </div>
                    <div class="modal-footer border-0 px-4 mb-3">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="bi bi-x-circle"></i> Cancelar</button>
                        <button type="submit" class="btn btn-danger" data-bs-dismiss="modal"><i class="bi bi-trash"></i> Confirmar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>