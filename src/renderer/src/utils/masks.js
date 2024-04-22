import { reactive } from "vue"

const maskcep = reactive({
    mask: "#####-###",
    eager: true
})

const maskdate = reactive({
    mask: "##/##/####",
    eager: true
})

const maskcpf = reactive({
    mask: "###.###.###-##",
    eager: true
})

const maskcnpj = reactive({
    mask: "##.###.###/####-##",
    eager: true
})

const maskphone = reactive({
    mask: "(##)#.####-####",
    eager: true
})

const maskmoney = {
    preProcess: val => val.replace(/[R$ .]/g, '').replace(/[,]/g, '.'),
    postProcess: val => {

    if(!val){
        return ''
    }

    const sub = 3 - (val.includes('.') ? val.length - val.indexOf('.') : 0)

    return Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val).replace(/[R$ ]/g, '').slice(0, sub ? -sub : undefined)
  }
}

const masknumbs = reactive({
    mask: "########",
    eager: true,
})

export default{
    maskcep,
    maskdate,
    maskcpf,
    maskcnpj,
    maskphone,
    maskmoney,
    masknumbs
}