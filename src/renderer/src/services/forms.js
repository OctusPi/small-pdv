function builddata(data){
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    return formData
}

function checkrule (rule, value){
    let isvalid = true
    let message = ''

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const regexPhone = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/
    const regexCPF = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/
    const regexDate = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/

    switch (rule) {
        case 'required':
            isvalid = typeof(value) == 'number' ? true : !(!value)
            message = isvalid ? '' : 'Campo obrigatório não informado!'
            break;
        case 'email':
            isvalid = regexEmail.test(value)
            message = isvalid ? '' : 'O Campor precisa ser um e-mail válido!'
            break;
        case 'phone':
            isvalid = regexPhone.test(value)
            message = isvalid ? '' : 'O Campor precisa ser um telefone válido!'
            break;
        case 'cpf':
            isvalid = regexCPF.test(value)
            message = isvalid ? '' : 'O Campor precisa ser um CPF válido!'
            break;
        case 'date':
            isvalid = regexDate.test(value)
            message = isvalid ? '' : 'O Campor precisa ser uma data válida!'
            break;
        default:
            break;
    }

    return {
        isvalid,
        message
    }
}

function checkform(data, rules){

    if(rules){

        const checks = []
        const messages = []
        const fields = rules.fields

        for (let field in fields) {

            const irules = fields[field].split('|')
            irules.forEach(r => {
                const check = checkrule(r, data[field])
                checks.push(check.isvalid)
                rules.valids[field] = false
                if (!check.isvalid) {
                    messages.push(check.message)
                    rules.valids[field] = true
                }
            });
        }

        return {
            isvalid: checks.every((v) => v == true),
            message: [...new Set(messages)].join(', ')
        }
    }

    return {
        isvalid: true,
        message: ''
    }
}

export default {
    builddata,
    checkform

}