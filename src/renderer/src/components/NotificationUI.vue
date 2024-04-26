<script setup>
import { onMounted, ref, watch } from 'vue';

const props    = defineProps({ alert:{ type: Object, required: true } })
const alert    = ref(props.alert)
const progress = ref('width:0%;')
const timeview = ref(0)
const alerts   = {
    success: { style: 'alert-success', icon: 'bi-check-circle-fill', title: 'Sucesso!', msg: 'Operação realizada com sucesso!' },
    warning: { style: 'alert-warning', icon: 'bi-exclamation-triangle-fill', title: 'Alerta!', msg: 'Falha ao realizar solicitação!' },
    danger: { style: 'alert-danger', icon: 'bi-x-octagon-fill', title: 'Ocorreu um problema!', msg: 'Algo deu errado, verifique e tente novamente!' },
    info: { style: 'alert-info', icon: 'bi-exclamation-triangle-fill', title: 'Atenção!', msg: '' }
}

watch(() => props.alert, (newValue) => {
   alert.value = newValue
});

function autoClose(){
    if(alert.value.show){
        progress.value = `width: ${(timeview.value*100)/70}%;`
        timeview.value++

        if(timeview.value >= 80){
            timeview.value = 0
            alert.value.show = false
        }
        
    }else{
        timeview.value = 0
        progress.value = 'width:0%;'
    }

}

onMounted(() => {
    setInterval(autoClose, 100)
})

</script>

<template>
    <div v-if="alert.show" class="alert p-4 rounded-4" :class="alerts[props.alert.data.type].style" role="alert">
        <div class="alert-heading d-flex justify-content-between align-items-center mb-2">
            <h4 class="p-0 m-0"><i class="me-1 bi" :class="alerts[props.alert.data.type].icon"></i> {{ alerts[props.alert.data.type].title }}</h4>
            <button type="button" aria-label="Close" @click="alert.show = false"><i class="bi bi-x-circle"></i></button>
        </div>
        <p class="small p-0 m-0">{{ alerts[props.alert.data.type].msg }}</p>
        <p v-if="props.alert.data.msg" class="small p-0 m-0">{{ props.alert.data.msg }}</p>
        
        <div class="progress mt-3" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="height: 1px">
            <div class="progress-bar" :style="progress"></div>
        </div>
    </div>
</template>