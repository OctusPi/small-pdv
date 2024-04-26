import path from'node:path'
import { Model, DataTypes, Sequelize} from 'sequelize';


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite')
});


class Tare extends Model {}

Tare.init({
    id:{ 
      type: DataTypes.BIGINT, 
      autoIncrement:true, 
      primaryKey:true
    },
    weight: {
      type: DataTypes.DOUBLE, 
      allowNull:false
    },
    type: {
      type: DataTypes.INTEGER, allowNull:false
    },
    pic: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    }
},{
  sequelize,
  timestamps: false
})

export default Tare
