import { ipcMain, MessageChannelMain } from 'electron'

class Ipc{
    constructor(webcontent){
        this.webcontent = webcontent
    }

    request(listen, callback){
        ipcMain.on(listen, (event, data) => {
            callback(data)
        })
    }

    response(listen, data){
        const { port1 } = new MessageChannelMain()
        this.webcontent.postMessage(listen, data, [port1])
    }

}

export default Ipc