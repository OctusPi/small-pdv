import { Model} from 'sequelize';

export default (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    cod: DataTypes.STRING,
    name: DataTypes.STRING,
    sale: DataTypes.INTEGER,
    unitpeso: DataTypes.DOUBLE,
    unitval: DataTypes.DOUBLE,
    pic: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};