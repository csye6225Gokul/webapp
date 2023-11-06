import baseRouter from './healthRoutes.js';
import assignmentRouter from './assignmentRoutes.js'
import logger from './logger.js';
export default(app) => {
    app.use('/',(req, res) => {
        res.set('Cache-Control', 'no-cache');
        res.status(200).send("You have reached Webapp");
    })
    app.use('/healthz',baseRouter)
    app.use('/v1/assignments',assignmentRouter)
    app.use((req, res) => {
        res.set('Cache-Control', 'no-cache');
        res.status(404).end();
    });
}