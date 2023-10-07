import request from 'supertest';
import app from '../src/app.js';
import { config } from 'dotenv';
import Sequelize from 'sequelize';

// config();


describe('GET /healthz', () => {
    it('should return status code 200', async () => {
      const response = await request(app).get('/hea');
      expect(response.status).toBe(200);
    });
  })

// describe('Health Endpoint', () => {
//     const DB_HOST = process.env.DB_HOST || 'localhost';
//     const DB_PORT = process.env.DB_PORT || '3306';
//     const DB_USER = process.env.DB_USER || 'root';
//     const DB_PASSWORD = process.env.DB_PASSWORD || 'msdIndu@99';
//     const DB_NAME = process.env.DB_NAME || 'webapp';
//     const mysqlUrl = `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

//     let sequelize;
//     console.log(process.env.DB_HOST )

//     beforeAll(() => {
//         sequelize = new Sequelize(mysqlUrl, {
//             dialectOptions: {
//                 ssl: false  
//             }
//         });
//     });

//     afterAll(async () => {
//         if (sequelize) {
//             await sequelize.close();
//         }
//     });

//     it('should return 200 when the database connection is successful', async () => {
//         try {
//             await sequelize.authenticate();
//         } catch (error) {
//             console.error(error);
//             fail('Database connection failed');
//         }

//         const res = await request(app).get('/healthz');
//         expect(res.statusCode).toEqual(200);
//     });

//     // it('should return 503 when the database connection fails', async () => {
//     //     const invalidMysqlUrl = `mysql://${DB_USER}:invalidpassword@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
//     //     const invalidSequelize = new Sequelize(invalidMysqlUrl, {
//     //         dialectOptions: {
//     //             ssl: false  
//     //         }
//     //     });

//     //     try {
//     //         await invalidSequelize.authenticate();
//     //         fail('Should not authenticate with invalid credentials');
//     //     } catch (error) {
//     //         console.error('Expected database connection failure:', error.message);
//     //     }

//     //     const res = await request(app).get('/healthz');
//     //     expect(res.statusCode).toEqual(503);

//     //     await invalidSequelize.close();
//     // });

//     // it('should return 400 when there are query parameters', async () => {
//     //     const res = await request(app).get('/healthz?param=value');
//     //     expect(res.statusCode).toEqual(400);
//     // });

//     // it('should return 400 when there is a content length', async () => {
//     //     const res = await request(app).get('/healthz').set('Content-Length', '10');
//     //     expect(res.statusCode).toEqual(400);
//     // });
// });
