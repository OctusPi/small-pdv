<script setup>
    import store from './../stores/local';
    import HeaderMain from '../components/HeaderMain.vue';

    const emit = defineEmits(['callAlert'])
    const admin = store.getAdmin()
</script>

<template>
    <main class="container-main">
        <HeaderMain :header="{icon:'bi-gear', title:'Ajustes'}"
        @callAlert="(data) => { emit('callAlert', data) }" />

        <div class="section-main d-md-flex justify-content-between">
            <div class="form-view m-2 bg-danger">
                form
            </div>
            <div class="preview m-2 px-4 text-center">
                <img class="logomarca" :src="`data:image/png;base64,${admin.logomarca}`">
            </div>
        </div>
    </main>
</template>

