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
    mask: "(##)9.####-####",
    eager: true
})

const moneybrl = reactive({
    mask: "R$ #.###,##",
    eager: true
})

const maskmoney = {
    preProcess: val => {
        const preval = val.replace(/[R$ .]/g, '').replace(/[,]/g, '.')
        console.log('preval', preval)
        return preval
    },
    postProcess: val => {

    if(!val){
        return ''
    }

    const sub = 3 - (val.includes('.') ? val.length - val.indexOf('.') : 0)

    const postval = Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val).replace(/R\$\s/g, '').slice(0, sub ? -sub : undefined)

    console.log('postval', postval)
    return postval
  }

}

const masknumbs = reactive({
    mask: "########",
    eager: true,
})

const maskpeso = reactive({
    mask: "#.###",
    eager: true,
})

export default{
    maskcep,
    maskdate,
    maskcpf,
    maskcnpj,
    maskphone,
    maskmoney,
    masknumbs,
    maskpeso,
    moneybrl
}