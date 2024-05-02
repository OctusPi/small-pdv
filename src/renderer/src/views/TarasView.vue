<script setup>
    import { onMounted, ref, watch } from 'vue';
    import Ipc from '../services/ipc'
    import masks from './../utils/masks'
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
            {key:'name', title:'IDENTIFICAÇÃO'},
            {key:'weight', title:'PESO'},
            {key:'type', title:'TIPO'},
            {key:'description', title:'DESCRIÇÃO'}
        ],
        datalist:[],
        views:{register: false, list:true },
        preview:{},
        selects:{
            types:[
                {id:1, title:'Descatável/Delivery'},
                {id:2, title:'Permanente/Local'}
            ]
        },
        uploads:{},
        rules:{
            fields:{
                name:'required',
                weight:'required',
                type: 'required'
            },
            valids:{}
        }
    })

    watch(() => props.updateList, (newdata) => {
        if(newdata > 0){
            ipc.request('query_db', {action:'Tare.all', data:{}})
            page.value.preview = {}
        }
    })

    function toggleView(view = null){

        switch (view) {
            case 'register':
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
        ipc.request('query_db', {action:'Tare.all', data:{}}, (datalist) => {
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

        const action = `Tare.${page.value.data.id ? 'update' : 'save'}`
        const data = page.value.data.id 
        ? {values:{...page.value.data}, where:{id:page.value.data.id}}
        : {...page.value.data}


        ipc.request('query_db', {action, data}, (data) => {
            if(data){
                toggleView()
                ipc.request('query_db', {action:'Tare.all', data:{}})
                emit('callAlert', notifys.success('Registro salvo com sucesso!'))
            }else{
                emit('callAlert', notifys.warning('Falha ao gravar dados!'))
            } 
        })

    }

    function updateData(){
        toggleView('register')
        page.value.data = page.value.preview
        page.value.uploads.url = `data:image/png;base64,${page.value.data.pic}`
    }

    function deleteData(){

        emit('callRemove', {action:'Tare.destroy', data:{id:page.value.preview.id}})
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
        :header="{icon:'bi-bounding-box', title:'Taras'}"
        @callAlert="(data) => { emit('callAlert', data) }" />
        
        <div class="section-main d-md-flex justify-content-between">
            
            <div class="ioview m-2">
                
                <!-- action bar -->
                <nav v-if="!page.views.register" class="text-end p-0">
                    <button @click="toggleView('register')" type="button" class="btn btn-lg btn-primary">
                        <i class="bi bi-plus-circle"></i> Adicionar
                    </button>
                </nav>

                <!-- box registe -->
                <div v-show="page.views.register" class="inside-container">
                    <div class="company-pic text-center mb-4 d-flex align-items-center justify-content-center">
                        <img v-if="page.uploads.url" :src="page.uploads.url" class="img-logo">
                        <span v-else class="small text-secondary d-block">Adicionar Imagem</span>
                        <input @change="handleFile" type="file" name="pic" class="company-pic-input" required />
			        </div>
                    <form @submit.prevent="saveData" class="row g-2 mb-3">
                        <div class="col-4">
                            <label for="name" class="form-label text-start">Identificação Tara <span class="small text-danger">*</span></label>
                            <input id="name" v-model="page.data.name" type="text"
                                :class="{ 'form-control-alert': page.rules.valids.name }" class="form-control"
                                placeholder="Nome Identificador" />
                        </div>
                        <div class="col-4">
                            <label for="weight" class="form-label text-start">Peso (gramas) <span class="small text-danger">*</span></label>
                            <input id="weight" v-model="page.data.weight" type="text"
                                :class="{ 'form-control-alert': page.rules.valids.weight }" class="form-control"
                                placeholder="0.000" v-maska:[masks.maskpeso] />
                        </div>
                        <div class="col-4">
                            <label for="type" class="form-label text-start">Tipo <span class="small text-danger">*</span></label>
                            <select id="type" v-model="page.data.type"
                                :class="{ 'form-control-alert': page.rules.valids.type }" class="form-control">
                                <option></option>
                                <option v-for="s in page.selects.types" :key="s.id" :value="s.id">{{ s.title }}</option>                        
                            </select>
                        </div>
                        <div class="col-12">
                            <label for="description" class="form-label text-start">Descrição (opcional)</label>
                            <input id="description" v-model="page.data.description" type="text"
                                :class="{ 'form-control-alert': page.rules.valids.description }" class="form-control"
                                placeholder="Descrição informativa sobre composição, durabilidade e preservação" />
                        </div>

                        <div class="mt-4">
                            <button type="submit" class="btn btn-lg btn-success me-2">
                                <i class="bi bi-check-circle"></i> Salvar
                            </button>
                            <button @click="toggleView()" type="button" class="btn btn-lg btn-secondary">
                                <i class="bi bi-x-circle"></i> Cancelar
                            </button>
                        </div>
                    </form>
                </div>

                <!-- box list -->
                <div v-show="page.views.list" class="inside-container mt-4">
                    <TableList 
                    :header="page.dataheader"
                    :body="page.datalist"
                    :casts="{'type':page.selects.types}"
                    @callSelection="selectItem"/>
                </div>
            </div>

            <div class="preview m-2 d-flex flex-column justify-content-center">
                <div v-if="page.preview?.name">
                    <div class="dataview mb-4">
                        <div class="ct-img-preview mb-4">
                            <img :src="`data:image/png;base64,${page.preview.pic}`" class="img-preview">
                        </div>

                        <h2>Identificação</h2>
                        <p>{{ page.preview.name }}</p>

                        <h2>Peso (gramas)</h2>
                        <p>{{ page.preview.weight }}</p>

                        <h2>Tipo</h2>
                        <p>{{ page.selects.types.find((obj) => obj.id === page.preview.type).title }}</p>

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
                    <i class="bi bi-front fs-3"></i>
                    <p class="small">Selecione um item para visualizar</p>
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