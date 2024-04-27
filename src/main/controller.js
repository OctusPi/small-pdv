import { ipcMain, MessageChannelMain } from 'electron'
import models from './models'
import notifys from './utils/notifys'

class Controller{
    constructor(webcontent){
        this.webcontent = webcontent
    }

    listen(){
        ipcMain.on('ping', (event, data) => {
            this.exec_query(data)
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

    async define_query(model, method, data = null){
        switch(method){
            case 'setup_check':
                return { setup: { value: await model.findOne() } }
            case 'setup_save':
                return { setup: { value: await this.save_setup(data) } }
            case 'all':
                return await model.findAll()
            case 'one':
                return await model.findOne(data ?? {})
            case 'save':
                return notifys.info('Dados Recebidos para salvar')
            default:
                return null
        }
    }

    async exec_query(data){
        const action = this.define_action(data)
        const model  = models[action.model]
        const method = action.method
        const query  = await this.define_query(model, method, data?.data)
        console.log(JSON.stringify(query))
        this.send(query)
    }

    async save_setup(data){
        const setting = await models['Setting'].create(data)
        return {setup:{value:setting.toJSON()}}
    }

}

export default Controller