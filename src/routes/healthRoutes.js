import express from 'express';
import * as healthController from './../controllers/healthController.js';

const Router = express.Router();

Router.route('/').get(healthController.get)
.all((req, res) => { 
    res.set('Cache-Control', 'no-cache');
    res.status(405).end();
    
  });
export default Router;