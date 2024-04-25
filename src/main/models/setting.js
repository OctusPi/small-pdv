import { DataTypes} from 'sequelize';
import conn from '../conn';

const Setting = conn.define(
  'Setting',
  {
    id:{ type: DataTypes.BIGINT, primaryKey:true, autoIncrement:true },
    logomarca: {type: DataTypes.STRING},
    company: {type: DataTypes.STRING, allowNull:false},
    address: {type: DataTypes.STRING, allowNull:false},
    phone: {type: DataTypes.STRING, allowNull:false},
    adminpass: {type: DataTypes.STRING, allowNull:false},
    token: {type: DataTypes.STRING, allowNull:false},
  }
);

export default Setting
