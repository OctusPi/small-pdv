
class Controller{
    async send(action, data){
       await window.electron.ipcRenderer.send('ping', { action, data })
    }

    async listen(callback){
       await window.electron.ipcRenderer.on('pong', (event, data) => {
            callback(data)
        })
    }
}

export default Controller