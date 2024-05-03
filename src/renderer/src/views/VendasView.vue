<script setup>
    import { onMounted, ref, watch } from 'vue';
    import Ipc from '../services/ipc'
    import masks from './../utils/masks'
    import utils from './../utils/utils'
    import forms from './../services/forms'
    import notifys from '@renderer/utils/notifys'
    import HeaderMain from '../components/HeaderMain.vue';
    import TableList from '../components/TableList.vue'

    const emit = defineEmits(['callAlert', 'callRemove'])
    const props = defineProps({
        updateList:{ type: Number }
    })
    const ipc = new Ipc()
    const page = ref({
        data:{},
        dataheader:[
            {key:'cod', title:'COD'},
            {key:'name', title:'IDENTIFICAÇÃO'},
            {key:'sale', title:'VENDA'},
            {key:'unitval', title:'VALOR'},
            {key:'unitpeso', title:'PESO'}
        ],
        datalist:[],
        views:{register: true, list:false },
        preview:{},
        selects:{
            sales:[
                {id:1, title:'Por Peso'},
                {id:2, title:'Por Unidade'}
            ]
        },
        uploads:{},
        rules:{
            fields:{
                cod:'required',
                sale:'required',
                name: 'required',
                unitval: 'required',
            },
            valids:{}
        }
    })

    watch(() => props.updateList, (newdata) => {
        if(newdata > 0){
            ipc.request('query_db', {action:'Product.all', data:{}})
            page.value.preview = {}
        }
    })

    function toggleView(view = null){

        switch (view) {
            case 'register':
                page.value.data.cod = page.value.data.cod ?? utils.rdname(8)
                page.value.views.register = true
                page.value.views.list = false
                break;
        
            default:
                page.value.views.register = false
                page.value.views.list = true
                page.value.data = {}
                page.value.uploads = {}
                break;
        }
    }

    function listData(){
        ipc.request('query_db', {action:'Product.all', data:{}}, (datalist) => {
            if(datalist && Array.isArray(datalist)){
                page.value.datalist = datalist.map((obj) => obj.dataValues)
            }
        })
    }

    function saveData(){

        const validation = forms.checkform(page.value.data, page.value.rules);
        if (!validation.isvalid) {
            emit('callAlert', notifys.warning(validation.message))
            return
        }

         //convert monetary values
         page.value.data.unitval = utils.toDouble(page.value.data.unitval)

        const action = `Product.${page.value.data.id ? 'update' : 'save'}`
        const data = page.value.data.id 
        ? {values:{...page.value.data}, where:{id:page.value.data.id}}
        : {...page.value.data}

        ipc.request('query_db', {action, data}, (data) => {
            if(data){
                toggleView()
                ipc.request('query_db', {action:'Product.all', data:{}})
                emit('callAlert', notifys.success('Registro salvo com sucesso!'))
            }else{
                emit('callAlert', notifys.warning('Falha ao gravar dados!'))
            } 
        })

    }

    function updateData(){
        toggleView('register')
        page.value.data = page.value.preview
        page.value.data.unitval = utils.toCurrency(page.value.data.unitval)
        page.value.uploads.url = `data:image/png;base64,${page.value.data.pic}`
    }

    function deleteData(){

        emit('callRemove', {action:'Product.destroy', data:{id:page.value.preview.id}})
    }

    function selectItem(id){
        page.value.preview = page.value.datalist.find((obj) => obj.id === id)
    }

    function handleFile(event) {
	    const file = event.target.files[0]
        if (file) {

            const reader  = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () =>{
                page.value.data.pic = reader.result.replace(/^data:image\/[a-z]+;base64,/, "")
            }
            page.value.uploads.url = file.path
        }
    }

    onMounted(() => {
        listData()
    })

</script>

<template>
    <main class="container-main">
        <HeaderMain 
        :header="{icon:'bi-receipt', title:'Vendas'}"
        @callAlert="(data) => { emit('callAlert', data) }" />
        
        <div class="section-main d-md-flex justify-content-between">
            
            <div class="ioview m-2">
                
                <!-- action bar -->
                <nav class="text-end p-0 mb-4">
                    <button v-if="page.views.register" @click="toggleView('list')" type="button" class="btn btn-lg btn-action">
                        <i class="bi bi-list-task"></i> Ultimas Vendas
                    </button>
                    <button v-if="!page.views.register" @click="toggleView('register')" type="button" class="btn btn-lg btn-action">
                        <i class="bi bi-list-task"></i> Nova Vendas
                    </button>
                </nav>

                <!-- box registe -->
                <div v-show="page.views.register" class="inside-container">
                    
                    <form @submit.prevent="saveData" class="row g-2 mb-3">
                        
                        <div class="col-9">
                            <label for="name" class="form-label text-start">Localizar Produto <span class="small text-danger">*</span></label>
                            <input id="name" v-model="page.data.name" type="text"
                                :class="{ 'form-control-alert': page.rules.valids.name }" class="form-control"
                                placeholder="Identificação do Produto"  />
                        </div>
                        <div class="col-3">
                            <label for="cod" class="form-label text-start">Peso/Quant. <span class="small text-danger">*</span></label>
                            <input id="cod" v-model="page.data.cod" type="text"
                                :class="{ 'form-control-alert': page.rules.valids.cod }" class="form-control"
                                placeholder="Código Produto" />
                        </div>
                        
                        <div class="mt-4">
                            <button type="submit" class="btn btn-lg btn-primary me-2">
                                <i class="bi bi-bag-plus"></i> Adicionar
                            </button>
                        </div>
                    </form>
                </div>

                <!-- box list -->
                <div v-show="page.views.list" class="inside-container">
                    <TableList 
                    :header="page.dataheader"
                    :body="page.datalist"
                    :casts="{'sale':page.selects.sales}"
                    @callSelection="selectItem"/>
                </div>
            </div>

            <div class="preview m-2 d-flex flex-column justify-content-center">
                <div v-if="page.preview?.name">
                    <div class="dataview mb-4">
                        <div class="ct-img-preview mb-4">
                            <img :src="`data:image/png;base64,${page.preview.pic}`" class="img-preview">
                        </div>

                        <h2>Código</h2>
                        <p>{{ page.preview.cod }}</p>

                        <h2>Identificação</h2>
                        <p>{{ page.preview.name }}</p>

                        <h2>Tipo de Venda</h2>
                        <p>{{ page.selects.sales.find((obj) => obj.id === page.preview.sale).title }}</p>

                        <h2>Valor R$</h2>
                        <p>{{ utils.toCurrency(page.preview.unitval) }}</p>

                        <h2>Peso (gramas)</h2>
                        <p>{{ `${page.preview.unitpeso ?? ''} ${page.preview.unitpeso >= 1 ? 'Kg' : 'gm'}` }} </p>
                        
                        <h2>Descrição</h2>
                        <p>{{ page.preview.description }}</p>
                        
                    </div>
                    <div class="actionsbtns text-center">
                        <button @click="updateData" type="button" class="btn btn-primary me-2">
                            <i class="bi bi-pen"></i> Editar
                        </button>
                        <button @click="deleteData" type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalDelete">
                            <i class="bi bi-trash"></i> Excluir
                        </button>
                    </div>
                </div>
                <div v-else class="text-center">
                    <i class="bi bi-basket2 fs-3"></i>
                    <p class="small">Caixa Livre</p>
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
        z-index: 1000;
    }
</style>