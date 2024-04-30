
import models from './models'

class Controller{

    define_action(data){
        const sdata = data.action.split('.')
        return { model: sdata[0], action: sdata[1] }
    }

    async define_query(model, method, data = null){
        let exec = null
        switch(method){
            case 'all':
                return await model.findAll()
            case 'one':
                return await model.findOne({where: data ?? {}})
            case 'save':
                exec = await model.create(data ?? {})
                return exec.toJSON()
            case 'update':
                exec = await model.update(data.values, {where:data.where})
                return exec.toJSON()
            case 'destroy':
                exec = await model.destroy({where:data})
                return exec
            default:
                return exec
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