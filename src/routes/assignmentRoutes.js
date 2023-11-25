import express from 'express';
import * as assignmentController from './../controllers/assignmentController.js';
import basicAuth from '../middleware/basicAuth.js'; 
const Router = express.Router();

Router.use(basicAuth);

Router.route('/').get(assignmentController.getAll)
                 .post(assignmentController.post)
                 .all((req, res) => { 
                  res.set('Cache-Control', 'no-cache');
                  res.status(405).end();
                  
                });
Router.route('/:id').get(assignmentController.get)
                    .put(assignmentController.put)
                    .delete(assignmentController.deleteAss)
                    .all((req, res) => { 
                      res.set('Cache-Control', 'no-cache');
                      res.status(405).end();
                      
                    });
Router.route('/:id/submission').post(assignmentController.postAssign)
                               .all((req, res) => { 
                                res.set('Cache-Control', 'no-cache');
                                res.status(405).end();
                              });

Router.route("*").all((req, res) => { 
  res.set('Cache-Control', 'no-cache');
  res.status(404).end();
  
});

export default Router;
