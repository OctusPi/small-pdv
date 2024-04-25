import { DataTypes} from 'sequelize';
import conn from '../conn';

const Tare = conn.define(
  'Tare',
  {
    id:{ type: DataTypes.BIGINT, primaryKey:true, autoIncrement:true },
    weight: {type: DataTypes.DOUBLE, allowNull:false},
    type: {type: DataTypes.INTEGER, allowNull:false},
    pic: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
  }
);

export default Tare
