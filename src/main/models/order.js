
import { DataTypes} from 'sequelize';
import conn from '../conn';

const Order = conn.define(
  'Order',
  {
    id:{ type: DataTypes.BIGINT, primaryKey:true, autoIncrement:true },
    seller: {type: DataTypes.STRING, allowNull:false},
    cod: {type: DataTypes.STRING, allowNull:false},
    dateandtime: {type: DataTypes.DATE, allowNull:false},
    items: {type: DataTypes.JSON, allowNull:false},
    total: {type: DataTypes.DOUBLE, allowNull:false},
    status: {type: DataTypes.BOOLEAN, allowNull:false}
  }
);

export default Order