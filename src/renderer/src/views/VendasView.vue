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
        item:null,
        selects:{
            tares:[],
            products:[],
            products_filter:[]
        },
        uploads:{},
        rules:{
            fields:{},
            valids:{}
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

    function selectItem(id){
        page.value.preview = page.value.datalist.find((obj) => obj.id === id)
    }

    function filterProducts(value){
        if(Array.isArray(page.value.selects.products) && value){
            page.value.selects.products_filter = (page.value.selects.products).filter(obj => (obj.dataValues.name).includes(value))
        }else{
            page.value.item = null
        }
    }

    function selectProduct(product){
        page.value.item = product
        page.value.data.product = product.name
        page.value.rules.valids = {}
        
        if(product.sale === 1){
            page.value.rules.fields = {
                product: 'required',
                tare: 'required',
                weight: 'required'
            }
        }else{
            page.value.rules.fields = {
                product: 'required',
                quantity: 'required'
            }
        }
    }

    onMounted(() => {
        ipc.request('query_db', {action:'Tare.all', data:{}}, (data) => {
            page.value.selects.tares = data
        })

        ipc.request('query_db', {action:'Product.all', data:{}}, (data) => {
            page.value.selects.products = data
        })

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
                        <i class="bi bi-cart-plus"></i> Nova Venda
                    </button>
                </nav>

                <!-- box registe -->
                <div v-show="page.views.register" class="inside-container">
                    
                    <form @submit.prevent="saveData" class="row g-2 mb-3">
                        
                        <div class="col-12 pe-0 position-relative">
                            <label for="product" class="form-label text-start">Localizar Produto <span class="small text-danger">*</span></label>
                            <input @keyup="filterProducts(page.data.product)" id="product" v-model="page.data.product" type="text"
                                :class="{ 'form-control-alert': page.rules.valids.product }" class="form-control"
                                placeholder="Identificação do Produto"  />

                            <div v-if="page.data.product && !page.item" class="position-absolute form-control select-item">
                                <ul class="p-0 m-0">
                                    <li v-for="s in page.selects.products_filter" 
                                    :key="s.dataValues.id"
                                    @click="selectProduct(s.dataValues)"
                                    class="d-flex align-items-center rounded p-2 m-0 mb-2 li-select-item">
                                        <img :src="`data:image/png;base64,${s.dataValues.pic}`" class="image-product-select me-2">
                                        <div class="fw-semibold">{{ s.dataValues.name }}</div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="col-6">
                            <label for="tare" class="form-label text-start">Tara <span class="small text-danger">*</span></label>
                            <select id="tare" v-model="page.data.tare" class="form-control" 
                            :class="{ 'form-control-alert': page.rules.valids.tare }">
                                <option></option>
                                <option v-for="s in page.selects.tares" :key="s.id">{{ `${s.dataValues.name} - (${s.dataValues.weight} gm)` }}</option>
                            </select>
                        </div>
                        <div class="col-3">
                            <label for="weight" class="form-label text-start">Peso <span class="small text-danger">*</span></label>
                            <input id="weight" v-model="page.data.weight" type="text"
                                :class="{ 'form-control-alert': page.rules.valids.weight }" class="form-control"
                                placeholder="0.000" v-maska:[masks.maskpeso] />
                        </div>
                        <div class="col-3 pe-0">
                            <label for="quantity" class="form-label text-start">Quant. <span class="small text-danger">*</span></label>
                            <input id="quantity" v-model="page.data.quantity" type="text"
                                :class="{ 'form-control-alert': page.rules.valids.quantity }" class="form-control"
                                placeholder="00000" v-maska:[masks.masknumbs] />
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
    .select-item{
        min-height: 100px;
        max-height: 250px;
        overflow: auto;
    }

    .image-product-select{
        width: 50px;
    }

    .li-select-item{
        cursor: pointer;
    }

    .li-select-item:hover{
        background: var(--color-input-border);
    }
</style>