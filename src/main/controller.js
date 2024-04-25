import { ipcMain, MessageChannelMain } from 'electron'
import exec from 'child_process'
import conn from './conn'
import models from './models'

class Controller{
    constructor(webcontent){
        this.webcontent = webcontent
    }

    listen(){
        ipcMain.on('ping', (event, data) => {
            this.exec_action()
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

    async exec_action(){
        const users = await models['setting'].findAll().then((result) => {
            console.log(users.every(result => result instanceof User)); // true
            console.log('All users:', JSON.stringify(result, null, 2));
            console.log(JSON.stringify(result, null, 2))
            this.send(result)
        })
        
    }

    async execute_query(model, action, data){
       conn.authenticate().then(async () => {
            switch(action){
                case 'list':
                    const k = await model.findAll().then(m => m)
                    return k
                case 'details':
                    return model.findOne({where:data}).then(m => m)

                default:
                    return null
                // case 'save':
                //     console.log('save: '+data)
                //     break
                // case 'update':
                //     console.log('update: '+data)
                //     break
                // case 'remove':
                //     console.log('remove: '+data)
                //     break
            }
        }).catch(err => {
            return 'Falha ao Conectar'
        })
    }

}

export default Controller