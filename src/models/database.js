import Sequelize from 'sequelize';

import { config } from 'dotenv';

config();

const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const host = process.env.MYSQL_HOST;
const port = process.env.MYSQL_PORT;
const database = process.env.MYSQL_DATABASE;
const mysqlUrl = `mysql://${user}:${password}@${host}:${port}`
const mysqlUrlDB = `mysql://${user}:${password}@${host}:${port}/${database}`

export const sequelize = new Sequelize(mysqlUrlDB, {
    dialectOptions: {
        ssl: false  
    },
    timezone: 'America/New_York' 
});

export default sequelize;

