<script setup>

    import utils from '../utils/utils';

    const props = defineProps({
        config:{type: Object, required:true},
        cart:{type:Object, required:true}
    })

</script>

<template>
    <header class="text-center">
        <img :src="config?.logomarca ? `data:image/png;base64,${config.logomarca}` : ''" class="logomarcra">
        <h1 class="p-0 m-0 fs-4">{{ config.company }}</h1>
        <p class="small p-0 m-0">{{ `${config.address} - ${config.phone}` }}</p>
    </header>

    <main class="my-4">
        <p class="m-0 p-0 small">{{ `Cod: ${cart.cod}` }}</p>
        <p class="m-0 p-0 small">{{ `Horário: ${cart.dateandtime}` }}</p>

        <table class="table-cart-products my-4">
            <thead>
                <tr>
                    <td>Prod.</td>
                    <td class="text-center">Peso</td>
                    <td class="text-center">Qaunt.</td>
                    <td>Unit.</td>
                    <td>Total</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in cart.items" :key="i.product.id">
                    <td class="align-middle">{{ i.product.name }}</td>
                    <td class="text-center align-middle">{{ i.weight }}</td>
                    <td class="text-center align-middle">{{ i.quantity }}</td>
                    <td class="align-middle">{{ utils.toCurrency(i.product.unitval) }}</td>
                    <td class="align-middle">{{ utils.toCurrency(utils.toDouble(i.value)) }}</td>
                </tr>
            </tbody>
        </table>
        
    </main>

    <footer class="mb-4">
        <h2 class="text-end fs-4 fw-bold m-0 p-0"> Total: {{ utils.toCurrency(cart.total) }}</h2>
    </footer>
</template>

<style scoped>

    *{
        font-weight: bold;
        font-family: monospace;
        font-size: 1rem;
    }

    .logomarcra{
        width: 100px;
        margin: 0 auto;
    }

    .table-cart-products{
        width: 100%;
    }

    .table-cart-products td{
        margin: 0;
        font-size: 1rem;
    }

</style>