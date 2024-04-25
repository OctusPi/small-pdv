import { DataTypes} from 'sequelize';
import conn from '../conn';

const Product = conn.define(
  'Product',
  {
    id:{ type: DataTypes.BIGINT, primaryKey:true, autoIncrement:true },
    cod: {type: DataTypes.STRING, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    sale: {type: DataTypes.INTEGER, allowNull: false},
    unitpeso: {type: DataTypes.DOUBLE, allowNull: true},
    unitval: {type: DataTypes.DOUBLE, allowNull: false},
    pic: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
  }
);

export default Product
