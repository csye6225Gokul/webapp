import Sequelize  from 'sequelize';
import logger from '../../logger.js';
import { config } from 'dotenv';
config();

export const dbConnect = async (req, res,sequelizeInstance = null) => {


// const user = process.env.MYSQL_USER;
// const password = process.env.MYSQL_PASSWORD;
// const host = process.env.MYSQL_HOST;
// const port = process.env.MYSQL_PORT;
// const database = process.env.MYSQL_DATABASE;
// const mysqlUrl = `mysql://${user}:${password}@${host}:${port}`

const { MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD } = process.env;

 


    console.log("inside service");
    logger.info("Inside assignment service")
    if (req.headers['content-length'] > 0){
        res.set('Cache-Control', 'no-cache');
        return res.status(400).end(); 
    }
    if (Object.keys(req.query).length > 0) {
        res.set('Cache-Control', 'no-cache');
        return res.status(400).end(); 
    }

    else{




const sequelize = new Sequelize({

    dialect: 'mysql',
  
    host: MYSQL_HOST,
  
    port: MYSQL_PORT,
  
    username: MYSQL_USER,     
  
    password: MYSQL_PASSWORD,     
  
  });

console.log("Before authenticate");
sequelize.authenticate()
    .then(() => {
        console.log("inside db") 
        logger.info("Inside db")
        res.set('Cache-Control', 'no-cache');
        res.status(200).end();  
        console.log('Connection has been established successfully.');

    })
    .catch(err => {
        console.log("Error block reached"); 
        logger.error("err")
        res.set('Cache-Control', 'no-cache');
        res.status(503).end(); 
        console.error('Unable to connect to the database:', err);
         
    });

}

return res;
}
