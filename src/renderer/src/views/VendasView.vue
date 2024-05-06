<script setup>
    import { onBeforeMount, ref, createApp } from 'vue';
    
    import Ipc from '../services/ipc'
    import masks from './../utils/masks'
    import utils from './../utils/utils'
    import dates from '../utils/dates';
    import store from '../stores/local';
    import forms from './../services/forms'
    import notifys from '@renderer/utils/notifys'

    import HeaderMain from '../components/HeaderMain.vue';
    import TableList from '../components/TableList.vue'
    import ReceiptView from './ReceiptView.vue';

    const emit = defineEmits(['callAlert', 'callRemove'])
    const ipc = new Ipc()
    const page = ref({
        config:{},
        data:{},
        dataheader:[
            {key:'cod', title:'COD'},
            {key:'seller', title:'IDENTIFICAÇÃO'},
            {key:'dateandtime', title:'VENDA'},
            {key:'total', title:'VALOR'}
        ],
        datalist:[],
        views:{register: true, list:false },
        preview: null,
        item:null,
        selects:{
            tares:[],
            products:[],
            products_filter:[]
        },
        rules:{
            fields:{},
            valids:{}
        }
    })
    
    const cart = ref({
        cod: '',
        seller: store.getAdmin() ? 'ADMINISTRADOR' : 'VENDEDOR',
        dateandtime: '',
        items:[],
        total: 0,
        status:true

    })

    function toggleView(view = null){

        switch (view) {
            case 'register':
                page.value.preview = null

                cart.value = {
                    cod: '',
                    seller: store.getAdmin() ? 'ADMINISTRADOR' : 'VENDEDOR',
                    dateandtime: '',
                    items:[],
                    total: 0,
                    status:true
                }
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
        ipc.request('query_db', {action:'Order.limit', data:{}}, (datalist) => {
            if(datalist && Array.isArray(datalist)){
                page.value.datalist = datalist.map((obj) => obj.dataValues)
            }
        })
    }

    function saveData(){
        console.log(cart.value)
        if(!cart.value.items.length){
            emit('callAlert', notifys.warning('O carrinho está vazio...'))
            return
        }

        const data = {...cart.value}
        data.items = JSON.stringify(cart.value.items)
        ipc.request('query_db', {action: 'Order.save', data:data}, (data) => {
            if(data){
                emit('callAlert', notifys.success('Venda salva com sucesso!'))
                cart.value.items = []
                page.value.data = {}

                ipc.request('query_db', {action:'Order.limit', data:{}})

                return;
            }

            emit('callAlert', notifys.warning('Falha ao salver venda!'))
        })

    }

    function selectItem(id){
        page.value.preview = page.value.datalist.find((obj) => obj.id === id)
        if(page.value.preview){
            const extractPreview = {...page.value.preview}
            extractPreview.items = JSON.parse(page.value.preview.items)
            cart.value = extractPreview
        }
        
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

    function cartAdd(){

        const validation = forms.checkform(page.value.data, page.value.rules);
        if (!validation.isvalid) {
            emit('callAlert', notifys.warning(validation.message))
            return
        }

        if(page.value.item){

            if(cart.value.items.length === 0){
                cart.value.cod = utils.rdname(12)
                cart.value.dateandtime = dates.dateTimeNowUtc()
            }
            
            //add product
            const product = {...page.value.item}
            const tare = (page.value.selects.tares).find(obj => obj.dataValues.id === page.value.data.tare)
            const item = {
                product:product,
                tare: tare,
                weight: page.value.data.weight,
                quantity: page.value.data.quantity,
                value: product.sale === 1 
                ? ((product.unitval / product.unitpeso) * (page.value.data.weight - tare.dataValues.weight)).toFixed(2) 
                : (product.unitval * page.value.data.quantity).toFixed(2)
            }
            cart.value.items.push(item)

            //sum total value cart
            cart.value.total += utils.toDouble(item.value)

            //clear to next product
            page.value.data = {}
            page.value.item = null
            page.value.rules.fields = {}
            return
        }

        emit('callAlert', notifys.warning('Selecione um item para adicionar ao carrinho!'))
    }

    function cartRemoveItem(item){
        cart.value.items = (cart.value.items).filter(obj => obj.product.id !== item.product.id)
        cart.value.total -= item.value
    }

    function cartCleanAll(){
        cart.value.items = []
        cart.value.total = 0
    }

    function cartPrint(){
        if(cart.value.items.length){

            window.print()
            return;
        
        }

        emit('callAlert', notifys.warning('O carrinho está vazio...'))
    }

    onBeforeMount(() => {
        ipc.request('query_db', {action:'Tare.all', data:{}}, (data) => {
            page.value.selects.tares = data
        })

        ipc.request('query_db', {action:'Product.all', data:{}}, (data) => {
            page.value.selects.products = data
        })
        
        ipc.request('query_db', {action:'Setting.one', data:{}}, (data) => {
            page.value.config = data?.dataValues
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
            
            <!-- box receipt -->
            <div class="print-container">
                <ReceiptView :config="page.config" :cart="cart" />
            </div>

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
                    
                    <form @submit.prevent="cartAdd" class="row g-2 mb-3">
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
                                <option v-for="s in page.selects.tares" :key="s.id" :value="s.dataValues.id">{{ `${s.dataValues.name} - (${s.dataValues.weight} gm)` }}</option>
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
                    :casts="{}"
                    @callSelection="selectItem"/>
                </div>

                
            </div>

            <div class="preview m-2 d-flex flex-column">
                <div v-if="cart.items.length">
                    <div class="dataview">
                        <table class="table table-striped table-cart-products">
                            <thead>
                                <tr>
                                    <th>Prod.</th>
                                    <th class="text-center">Peso</th>
                                    <th class="text-center">Qaunt.</th>
                                    <th>Unit.</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="i in cart.items" :key="i.product.id">
                                    <td class="align-middle">{{ i.product.name }}</td>
                                    <td class="text-center align-middle">{{ i.weight }}</td>
                                    <td class="text-center align-middle">{{ i.quantity }}</td>
                                    <td class="align-middle">{{ utils.toCurrency(i.product.unitval) }}</td>
                                    <td class="align-middle">{{ utils.toCurrency(utils.toDouble(i.value)) }}</td>
                                    <td class="align-middle"><i  v-if="!page.preview" @click="cartRemoveItem(i)" class="bi bi-x hover-danger"></i></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="info-pedido my-3">
                        <h2 class="text-end fs-4 fw-bold m-0 p-0"> Total: {{ utils.toCurrency(cart.total) }}</h2>
                    </div>

                    <div class="actionsbtns text-center">
                        <button @click="cartPrint" type="button" class="btn btn-primary me-2">
                            <i class="bi bi-printer"></i> Imprimir
                        </button>
                        <button v-if="!page.preview" @click="saveData" type="button" class="btn btn-success me-2">
                            <i class="bi bi-check-circle"></i> Confirmar
                        </button>
                        <button v-if="!page.preview" @click="cartCleanAll" type="button" class="btn btn-danger">
                            <i class="bi bi-trash"></i>
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

<style>
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

    .table-cart-products td{
        font-size: small;
        margin: 0;
    }

    .print-container {
        display: none;
    }


    @media print {

        .container-main {
            margin: 0;
            padding: 0;
            width: 100%;
        }

        .main-nav, .header-main, .header-main *, .ioview, .ioview *, .preview, .preview *{
            display: none;
        }

        .print-container {
            /* Estilos específicos para o componente durante a impressão */
            display: block !important; /* Garante que o componente seja exibido durante a impressão */
        }
    }
</style>