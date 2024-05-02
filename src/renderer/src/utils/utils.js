function load(status = true){
    const element = document.getElementById('load-wall')
    if (element) {
        status ? element.classList.remove('d-none') : element.classList.add('d-none')
    }
}

function rdname(tamanho) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    let nome = '';
    for (let i = 0; i < tamanho; i++) {
      nome += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
  
    return nome;
}

function toCurrency(value){
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function toDouble(value){
  return parseFloat(value.replace(',', '.'))
}

export default {
    load,
    rdname,
    toCurrency,
    toDouble
}