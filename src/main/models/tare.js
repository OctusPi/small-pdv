import { Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class Tare extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tare.init({
    weight: DataTypes.DOUBLE,
    type: DataTypes.INTEGER,
    pic: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tare',
  });
  return Tare;
};