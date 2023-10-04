import app from './src/app.js';
import loadData from './src/util/dbLoader.js';
import Sequelize from 'sequelize';

import { config } from 'dotenv';

config();



const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOST;
const port = process.env.MYSQL_PORT;
const database = process.env.MYSQL_DATABASE;
const sequelize = new Sequelize({
  dialect: 'mysql', // Use the correct database dialect (e.g., 'mysql', 'postgres', etc.)
  host: host,
  username: user,
  password: password,
  database: database,

});

sequelize.sync({ alter: true });

const ports = 9000;
app.listen(ports, () => {
  console.log(`Server is running on port ${ports}`);
  loadData();
});
