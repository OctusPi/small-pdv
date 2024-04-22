function pad(numero, tamanho) {
    return String(numero).padStart(tamanho, '0');
}

function dateNow() {
    const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const mesesDoAno = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
    const dataAtual = new Date();
    const diaSemana = diasDaSemana[dataAtual.getDay()];
    const dia = dataAtual.getDate();
    const mes = mesesDoAno[dataAtual.getMonth()];
    const ano = dataAtual.getFullYear();
  
    return `${diaSemana}, ${dia} de ${mes} de ${ano}`;
}

function hourNow() {
    const dataAtual = new Date();
    const hora = pad(dataAtual.getHours(), 2);
    const minutos = pad(dataAtual.getMinutes(), 2);
    const segundos = pad(dataAtual.getSeconds(), 2);
  
    return `${hora}:${minutos}:${segundos}`;
}

export default {
    dateNow,
    hourNow
}