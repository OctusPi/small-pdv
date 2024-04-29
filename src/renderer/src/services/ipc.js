
class Ipc{
    
    async request(listen, data, callback = null){
        data.listen = listen
        await window.electron.ipcRenderer.send(listen, data)
        if(callback){ this.response(listen, callback) }
    }

    async response(listen, callback){
        await window.electron.ipcRenderer.on(listen, (event, data) => {
            callback(data)
        })
    }
}

export default Ipc