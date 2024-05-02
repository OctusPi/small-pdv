
class Ipc{
    
    async request(listen, data, callback = null){
        await window.electron.ipcRenderer.send(listen, data)
        if(callback){ await this.response(data.action, callback) }
    }

    async response(listen, callback){
        await window.electron.ipcRenderer.on(listen, (event, data) => {
            callback(data)
        })
    }
}

export default Ipc