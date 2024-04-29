
import models from './models'
import notifys from './utils/notifys'

class Controller{

    define_action(data){
        const sdata = data.action.split('.')
        return { model: sdata[0], action: sdata[1] }
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
                return await model.findOne({where: data ?? {}})
            case 'save':
                const exec = await model.create(data ?? {})
                return exec.toJSON()
            default:
                return null
        }
    }

    async exec_query(data){
        const def_action = this.define_action(data)
        const model  = models[def_action.model]
        const action = def_action.action
        return await this.define_query(model, action, data?.data)
    }

    async save_setup(data){
        const setting = await models['Setting'].create(data)
        return {setup:{value:setting.toJSON()}}
    }
}

export default Controller