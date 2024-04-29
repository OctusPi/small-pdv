<script setup>
import HeaderMain from '../components/HeaderMain.vue';

const emit = defineEmits(['callAlert'])


</script>

<template>
    <main class="container-main">
        <HeaderMain 
        :header="{icon:'bi-receipt', title:'Vendas'}" 
        @callAlert="(data) => { emit('callAlert', data) }" />
        
            <div class="px-4 py-3">
            Conteudo View
        </div>
    </main>
</template>