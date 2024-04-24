import { ipcMain, MessageChannelMain } from 'electron'
import conn from './conn'
import models from './models'

class Controller{
    constructor(webcontent){
        this.webcontent = webcontent
    }

    listen(){
        ipcMain.on('ping', (event, data) => {
            const action = this.define_action(data)
            this.exec_action(action, data.data)
        })
    }

    send(data){
        const { port1 } = new MessageChannelMain()
        this.webcontent.postMessage('pong', data, [port1])
    }

    define_action(data){
        const sdata = data.action.split('.')
        return {
            model: sdata[0],
            method: sdata[1]
        }
    }

    exec_action(action, data){
        const model = models[action.model]

        switch(action.method){
            case 'list':
                this.send(model.findAll())
                break
            case 'search':
                this.send(model.findAndCountAll({where:data}))
                break
            case 'details':
                this.send(model.findOne({where:data}))
                break
            case 'save':
                console.log('save: '+data)
                break
            case 'update':
                console.log('update: '+data)
                break
            case 'remove':
                console.log('remove: '+data)
                break
        }
    }

}

export default Controller