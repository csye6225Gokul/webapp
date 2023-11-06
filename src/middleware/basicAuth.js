// middleware/basicAuth.js


import {Account} from '../models/index.js'; // Adjust the path accordingly
import bcrypt from 'bcrypt';
import {statsdMiddleware}from '../../statsd.js'

const basicAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, encodedCredentials] = authHeader.split(' ');
    

    if (type.toLowerCase() !== 'basic') {
      res.set('WWW-Authenticate', 'Basic realm="Secure Area"');
      return res.status(401).send('Expected a Basic Auth header');
    }

    console.log("In middleware")

    const [email, password] = Buffer.from(encodedCredentials, 'base64').toString('utf8').split(':');
    console.log(email)
    
    const account = await Account.findOne({ where: { email } });

    if(account == null){
      return res.status(401).send('Invalid email or password');
    }

    if (!await bcrypt.compare(password.trim(),account.password)) {
      return res.status(401).send('Invalid email or password');
    }
    console.log(req.body)
    req.user = account;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default basicAuth;
