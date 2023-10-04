import express from 'express';
import cors from 'cors';
// import loadData from './util/dbLoader.js'
import bodyParser from 'body-parser';
import routes from './routes/index.js';

const app = express();

app.use(bodyParser.json());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // It's good to specify the extended option for express.urlencoded()
app.use(cors());

routes(app);

export default app;  
