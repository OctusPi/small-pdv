import path from'node:path'
import { Model, DataTypes, Sequelize} from 'sequelize';


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

class Order extends Model {}

Order.init({
    id:{ 
      type: DataTypes.BIGINT, 
      autoIncrement:true,
      primaryKey:true
    },
    seller: {
      type: DataTypes.STRING, 
      allowNull:false
    },
    cod: {
      type: DataTypes.STRING, 
      allowNull:false
    },
    dateandtime: {
      type: DataTypes.DATE, 
      allowNull:false
    },
    items: {
      type: DataTypes.JSON, 
      allowNull:false
    },
    total: {
      type: DataTypes.DOUBLE, 
      allowNull:false
    },
    status: {
      type: DataTypes.BOOLEAN, 
      allowNull:false
    }
},{
  sequelize,
  timestamps: false
})

export default Order