import path from'node:path'
import { Sequelize } from 'sequelize'

const conn = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite')
});


export default conn