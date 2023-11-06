import StatsD from 'hot-shots';
import express from 'express';

// Create a StatsD client instance
const statsd = new StatsD({
  host: 'localhost', // Replace with your StatsD server address
  port: 8125, // Default StatsD port
  prefix: 'myapp.', // Optional prefix for all stats names
  errorHandler: (error) => {
    console.error('StatsD error:', error);
  },
});



// StatsD middleware to count requests and track response time
export const statsdMiddleware = (req, res, next) => {
    const startTime = process.hrtime();
    
    // Use req.path instead of req.route.path to avoid the undefined issue
    const path = req.path === '/' ? 'root' : req.path.replace(/^\//, '').replace(/\//g, '_');
    const method = req.method.toLowerCase();
    const routeName = `${method}.${path}`; // Create a metric name e.g., get.users_userId
  
    // Increment request counter for each unique API endpoint
    statsd.increment(`api.requests.${routeName}`);

    console.log(routeName)
  
    // Use the 'finish' event to calculate the response time
    res.once('finish', () => {
      const duration = process.hrtime(startTime);
      const responseTimeInMs = (duration[0] * 1000) + (duration[1] / 1e6);
      statsd.timing(`api.response_time.${routeName}`, responseTimeInMs);
    });
  
    next();
  };
  