<script setup>
import { onMounted, ref, watch } from 'vue';
import Ipc from '../services/ipc'
import masks from './../utils/masks'
import HeaderMain from '../components/HeaderMain.vue';
import TableList from '../components/TableList.vue'
import dates from '../utils/dates';
import utils from '../utils/utils';

const emit = defineEmits(['callAlert', 'callRemove'])
const props = defineProps({
    updateList: { type: Number }
})
const ipc = new Ipc()
const page = ref({
    data: {},
    dataheader: [
        { key: 'cod', title: 'COD' },
        { key: 'seller', title: 'IDENTIFICAÇÃO' },
        { key: 'dateandtime', title: 'VENDA' },
        { key: 'total', title: 'VALOR' }
    ],
    datalist: [],
    report: {
        search: '',
        total: 0,
        amount: 0
    }
})

const cart = ref({

    id: 0,
    items: [],
    total: 0,


})

watch(() => props.updateList, (newdata) => {
    if (newdata > 0) {
        page.value.datalist = (page.value.datalist).filter(obj => obj.id !== newdata)
        page.value.report.total = (page.value.datalist).length

        let amount = 0
        page.value.datalist.forEach(e => {
            amount += e.total
        })

        page.value.report.amount = utils.toCurrency(amount)

        cart.value = {

            id: 0,
            items: [],
            total: 0,


        }
    }
})

function prepareWhereData() {
    const where = {}
    where.between = [dates.dateToUtc(page.value.data.datein), dates.dateToUtc(page.value.data.dateout)]
    return where;
}

function listData() {

    ipc.request('query_db', { action: 'Order.between', data: prepareWhereData() }, (datalist) => {
        if (datalist && Array.isArray(datalist)) {
            page.value.datalist = datalist.map((obj) => obj.dataValues)

            page.value.report.search = (page.value.data.datein ?? '') + ' ' + (page.value.data.dateout ?? '')
            page.value.report.total = (page.value.datalist).length

            let amount = 0
            page.value.datalist.forEach(e => {
                amount += e.total
            })

            page.value.report.amount = utils.toCurrency(amount)
        }
    })
}

function deleteData() {

    emit('callRemove', { action: 'Order.destroy', data: { id: cart.value.id } })
}

function selectItem(id) {
    const selected = page.value.datalist.find((obj) => obj.id === id)


    cart.value.id = id
    cart.value.items = JSON.parse(selected.items)
    cart.value.total = selected.total
}

function printReport() {
    window.print()
}


</script>

<template>
    <main class="container-main">
        <HeaderMain :header="{ icon: 'bi-journal-bookmark-fill', title: 'Relatórios' }"
            @callAlert="(data) => { emit('callAlert', data) }" />

        <div class="section-main d-md-flex justify-content-between">

            <div class="print-container">
                    <!-- resume report -->
                    <div v-if="page.datalist.length" class="remume-report text-white d-flex my-4">
                        <div class="me-4 p-3 rounded bg-info">
                            <h1 class="fw-bold"><i class="bi bi-calendar me-2"></i> Relatório</h1>
                            <p class="p-0 m-0">{{ page.report.search }}</p>
                        </div>
                        <div class="me-4 p-3 rounded bg-primary">
                            <h1 class="fw-bold"> <i class="bi bi-bounding-box me-2"></i> Qt. de Vendas</h1>
                            <p class="p-0 m-0 fs-4 fw-bold">{{ page.report.total }}</p>
                        </div>
                        <div class="p-3 rounded bg-success">
                            <h1 class="fw-bold"><i class="bi bi-coin me-2"></i> Valor Faturado</h1>
                            <p class="p-0 m-0 fs-4 fw-bold">{{ page.report.amount }}</p>
                        </div>
                    </div>

                    <!-- box list -->
                    <div class="inside-container">
                        <TableList :header="page.dataheader" :body="page.datalist" :casts="{}"
                            @callSelection="selectItem" />
                    </div>

                </div>

            <div class="ioview m-2">

                <!-- search bar -->
                <div class="search-box mb-4">
                    <form class="row g-3" @submit.prevent="listData">

                        <div class="col-6">
                            <label for="data-in" class="form-label text-start">Data Inicial </label>
                            <input id="data-in" v-model="page.data.datein" type="text" class="form-control"
                                placeholder="DD/MM/AAAA" v-maska:[masks.maskdate] />
                        </div>
                        <div class="col-6">
                            <label for="data-out" class="form-label text-start">Data Final </label>
                            <input id="data-out" v-model="page.data.dateout" type="text" class="form-control"
                                placeholder="DD/MM/AAAA" v-maska:[masks.maskdate] />
                        </div>

                        <div class="text-end mt-4">
                            <button type="submit" class="btn btn-lg btn-action me-2">
                                <i class="bi bi-search"></i> Localizar
                            </button>

                            <button @click="printReport" type="button" class="btn btn-lg btn-primary me-2">
                                <i class="bi bi-printer"></i> Imprimir
                            </button>
                        </div>
                    </form>
                </div>

                <hr>
                <div class="print-container-view">
                    <!-- resume report -->
                    <div v-if="page.datalist.length" class="remume-report text-white d-flex my-4">
                        <div class="me-4 p-3 rounded bg-info">
                            <h1 class="fw-bold"><i class="bi bi-calendar me-2"></i> Relatório</h1>
                            <p class="p-0 m-0">{{ page.report.search }}</p>
                        </div>
                        <div class="me-4 p-3 rounded bg-primary">
                            <h1 class="fw-bold"> <i class="bi bi-bounding-box me-2"></i> Qt. de Vendas</h1>
                            <p class="p-0 m-0 fs-4 fw-bold">{{ page.report.total }}</p>
                        </div>
                        <div class="p-3 rounded bg-success">
                            <h1 class="fw-bold"><i class="bi bi-coin me-2"></i> Valor Faturado</h1>
                            <p class="p-0 m-0 fs-4 fw-bold">{{ page.report.amount }}</p>
                        </div>
                    </div>

                    <!-- box list -->
                    <div class="inside-container">
                        <TableList :header="page.dataheader" :body="page.datalist" :casts="{}"
                            @callSelection="selectItem" />
                    </div>

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
                                    <td class="align-middle"><i v-if="!page.preview" @click="cartRemoveItem(i)"
                                            class="bi bi-x hover-danger"></i></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="info-pedido my-3">
                        <h2 class="text-end fs-4 fw-bold m-0 p-0"> Total: {{ utils.toCurrency(cart.total) }}</h2>
                    </div>

                    <div class="actionsbtns text-center">

                        <button @click="deleteData" type="button" class="btn btn-danger" data-bs-toggle="modal"
                            data-bs-target="#modalDelete">
                            <i class="bi bi-trash"></i> Excluir Venda
                        </button>
                    </div>
                </div>
                <div v-else class="text-center">
                    <i class="bi bi-boxes fs-3"></i>
                    <p class="small">Selecione um Item para Visualizar</p>
                </div>
            </div>
        </div>
    </main>
</template>

<style>
.print-container {
        display: none;
    }

@media print {

* {
background-color: transparent !important;
margin: 0 !important;
padding: 0 !important;
color: black;
}

.container-main {
margin: 0;
padding: 0;
width: 100%;
}

.section-main {
width: 100%;
height: auto;
margin: 0;
padding: 0;
}

.main-nav,
.main-nav *,
.header-main,
.header-main *,
.ioview,
.ioview *,
.preview,
.preview *,
.alert,
.modal 
.modal-dialog{
display: none;
background-color: transparent;
padding: 0;
margin: 0;
}

.print-container {
    /* Estilos específicos para o componente durante a impressão */
    display: block !important; /* Garante que o componente seja exibido durante a impressão */
}
}

</style>