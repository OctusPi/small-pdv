import { format } from 'date-fns';

function pad(numero, tamanho) {
    return String(numero).padStart(tamanho, '0');
}

function dateNow() {
    const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const mesesDoAno = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
    const dataAtual = new Date();
    const diaSemana = diasDaSemana[dataAtual.getDay()];
    const dia = pad(dataAtual.getDate(), 2);
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

function dateNowUtc(){
    const dataAtual = new Date();
    const dia = pad(dataAtual.getDate(), 2);
    const mes = pad(dataAtual.getMonth()+1,2);
    const ano = dataAtual.getFullYear();

    return `${ano}-${mes}-${dia}`
}

function dateTimeNowUtc(){
    const dataAtual = new Date();
    const dia = pad(dataAtual.getDate(), 2);
    const mes = pad(dataAtual.getMonth()+1,2);
    const ano = dataAtual.getFullYear();
    const hora = pad(dataAtual.getHours(), 2);
    const minutos = pad(dataAtual.getMinutes(), 2);
    const segundos = pad(dataAtual.getSeconds(), 2);

    return `${ano}-${mes}-${dia} ${hora}:${minutos}:${segundos}`
}

function dateToPtBr(utcdate){
    return format(new Date(utcdate), 'dd/MM/yyyy HH:mm:ss')
}

function dateToUtc(ptbrdate) {

    if(ptbrdate){
        // Dividir a string da data em dia, mês e ano
        const partes = ptbrdate.split('/');
        const dia = partes[0];
        const mes = partes[1];
        const ano = partes[2];
    
        // Criar uma nova data no formato "mm/dd/yyyy"
        const dataFormatada = new Date(`${mes}/${dia}/${ano}`);
    
        // Extrair a data em formato UTC "yyyy-mm-dd"
        const dataUTC = dataFormatada.toISOString().split('T')[0];
    
        return dataUTC;
    }
    
    return dateTimeNowUtc()
  }

export default {
    dateNow,
    hourNow,
    dateNowUtc,
    dateTimeNowUtc,
    dateToPtBr,
    dateToUtc
}