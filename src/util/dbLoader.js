import { Sequelize } from 'sequelize';
import fs from 'fs';
import csv from 'csv-parser';
import Account from '../models/account.js';
import Assignment from '../models/assignment.js';
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

async function ensureDatabaseExists() {
  const tmpSequelize = new Sequelize(mysqlUrl, { logging: false });

  try {
    await tmpSequelize.query(`CREATE DATABASE IF NOT EXISTS ${database};`);
    console.log('Database ensured.');
  } catch (err) {
    console.error('Error while ensuring database exists', err);
    throw err;
  } finally {
    await tmpSequelize.close();
  }
}

export default async function loadData() {
  await ensureDatabaseExists();

  try {
    await sequelize.authenticate();
    console.log('Connection to database established.');

    const AccountModel = Account(sequelize);
    const AssignmentModel = Assignment(sequelize);

    await AccountModel.sync();
    await AssignmentModel.sync();

    // The main change: location of the CSV file
    const csvFilePath = '/opt/users.csv';

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', async (row) => {
        try {
          const existingAccount = await AccountModel.findOne({ where: { email: row.email } });

          if (!existingAccount) {
            row.password = row.password.trim();
            await AccountModel.create(row);
            console.log(`Added account for: ${row.email}`);
          } else {
            console.log(`Account for ${row.email} already exists. Skipping.`);
          }
        } catch (err) {
          console.error(`Error processing record for ${row.email}:`, err);
        }
      })
      .on('end', () => {
        console.log('CSV file processing completed.');
      });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

}

