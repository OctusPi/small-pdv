import path from'node:path'
import { Model, DataTypes, Sequelize} from 'sequelize';


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

class Setting extends Model {}

Setting.init({
    id:{ type: DataTypes.BIGINT, 
      autoIncrement:true, 
      primaryKey:true
    },
    logomarca: {
      type: DataTypes.STRING
    },
    company: {
      type: DataTypes.STRING, 
      allowNull:false
    },
    address: {
      type: DataTypes.STRING, 
      allowNull:false
    },
    phone: {
      type: DataTypes.STRING, 
      allowNull:false
    },
    adminpass: {
      type: DataTypes.STRING, 
      allowNull:false
    },
    token: {
      type: DataTypes.TEXT, 
      allowNull:false
    },
},{
  sequelize,
  timestamps: false
})

export default Setting
