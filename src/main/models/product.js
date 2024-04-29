import path from'node:path'
import { Model, DataTypes, Sequelize} from 'sequelize';


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});


class Product extends Model {}
Product.init({
    id:{ 
      type: DataTypes.BIGINT, 
      autoIncrement:true,
      primaryKey:true
    },
    cod: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    name: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    sale: {
      type: DataTypes.INTEGER, 
      allowNull: false
    },
    unitpeso: {
      type: DataTypes.DOUBLE, 
      allowNull: true
    },
    unitval: {
      type: DataTypes.DOUBLE, 
      allowNull: false
    },
    pic: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
},{
  sequelize,
  timestamps: false
})


export default Product
