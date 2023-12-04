import baseRouter from './healthRoutes.js';
import assignmentRouter from './assignmentRoutes.js'
import logger from '../../logger.js';
import {statsdMiddleware}from '../../statsd.js'
import axios from 'axios';
export default(app) => {

    app.use(statsdMiddleware)
    app.use('/healthz',baseRouter)
    app.use('/v2/assignments',assignmentRouter)
    app.use('/',async (req, res, next) => {

      if (req.path === '/') {
        try {
          // You can extend this with more metadata fields if required
          const localIPv4 = await axios.get('http://169.254.169.254/latest/meta-data/local-ipv4');
          const publicIPv4 = await axios.get('http://169.254.169.254/latest/meta-data/public-ipv4');
          let data =  {
            localIPv4: localIPv4.data,
            publicIPv4: publicIPv4.data,
          };
          return res.json(data).status(200);
  
        } catch (error) {
          res.set('Cache-Control', 'no-cache');
          return res.status(200).send("You have reached Webapp");
          console.error('Error fetching EC2 metadata:', error);
        }
    } else {
        next(); // Pass control to the next middleware function
    }  
  })
    app.use('/*',(req, res) => {
      res.set('Cache-Control', 'no-cache');
      res.status(404).end();
  });
    
}