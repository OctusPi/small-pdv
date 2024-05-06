<script setup>
    import { ref, watch } from 'vue'
    import utils from '../utils/utils';
import dates from '../utils/dates';

    const props = defineProps({
        header  :{type: Array},
        body    :{type: Array, default: () => []},
        casts   :{type: Object}
    })
    
    const emit  = defineEmits(['callSelection'])
    const body  = ref(props.body)
    const idselected = ref(null)
    
    watch(() => props.body, (newValue) => {
        body.value = newValue
    });

    function orderBy(key){
        body.value.sort((a,b) => {
            if(typeof a[key] === 'string'){
                return a[key].localeCompare(b[key])
            }
            return a[key] - b[key]
        })
    }

    function casting(key, search, subject, extract = null){
        
        const findObj = subject.find(obj => obj[key] === search)
        return extract && findObj && findObj[extract] ? findObj[extract] ?? '' : findObj
    }

    function getvalue(key, obj){
       
        switch (key) {
            case 'unitval':
            case 'total':
                return obj[key] ? utils.toCurrency(obj[key]) : ''
            case 'dateandtime':
                return obj[key] ? dates.dateToPtBr(obj[key]) : ''
            default:
                return obj[key];
        }
    }

    function selectItem(id){
        idselected.value = id
        emit('callSelection', id)
    }
</script>

<template>
    <div v-if="body.length" class="table-responsive-sm">
        <table class="table table-striped table-hover">
            <thead v-if="props.header">
                <tr>
                    <th scope="col" v-for="h in props.header" :key="h.key" @click="orderBy(h.key)">{{ h.title }}<i class="bi bi-arrow-down-up ms-2 table-order-icon"></i></th>
                </tr>
            </thead>
            <tbody v-if="body">
                <tr @click="selectItem(b.id)" v-for="b in body" :key="b.id" :class="{'selected':idselected===b.id }">
                    <td v-for="h in props.header" :key="`${b.id}-${h.key}`" class="align-middle p-3">
                        {{ props.casts[h.key] ? casting('id', b[h.key], props.casts[h.key], 'title') : getvalue(h.key, b) }}
                        <p v-if="h.sub" class="small txt-color-sec p-0 m-0">
                            <span 
                                v-for="s in h.sub" :key="s.key" 
                                class="inline-block small">
                                {{ `${s.title ?? ''} ${props.casts[s.key] ? casting('id', b[s.key], props.casts[s.key], 'title') :  b[s.key] ?? '' }` }} 
                            </span>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-else class="text-center txt-color-sec">
        <i class="bi bi-boxes fs-4"></i>
        <p class="small">Não foram localizados registros...</p>
    </div>
</template>

<style>
    .table, .table th, .table td{
        background-color: transparent !important;
        color: var(--color-text);
        cursor: pointer;
    }

    .table th{
        font-weight: 600;
        font-size: small;
    }
    .table-order-icon{
        font-size: small;
    }

    .table th:hover i{
        color: var(--color-base);
    }

    .selected{
        background-color: aqua;
    }
    
   
</style>