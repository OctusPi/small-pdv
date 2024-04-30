<script setup>
    import HeaderMain from '../components/HeaderMain.vue';

    const emit = defineEmits(['callAlert'])
</script>

<template>
    <main class="container-main">
        <HeaderMain :header="{icon:'bi-exclamation-diamond', title:'Acesso Negado'}"
        @callAlert="(data) => { emit('callAlert', data) }" />

        <div class="section-main d-md-flex flex-column">
            <p class="text-center">
                <img src="./../assets/403.svg">
            </p>
            <h1 class="text-center">Acesso não permitido!</h1>
            <p class="text-center">Área permitida apenas para administradores do sistema, coso insista o erro será reportado!</p>
        </div>
    </main>
</template>

<style scoped>
    img{
        width: 400px;
        margin: 0 auto;
    }
</style>