import { Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class Setting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Setting.init({
    logomarca: DataTypes.STRING,
    company: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    adminpass: DataTypes.STRING,
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Setting',
  });
  return Setting;
};