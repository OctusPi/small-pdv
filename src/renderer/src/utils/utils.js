function load(status = true){
    const element = document.getElementById('load-wall')
    if (element) {
        status ? element.classList.remove('d-none') : element.classList.add('d-none')
    }
}

export default {
    load
}