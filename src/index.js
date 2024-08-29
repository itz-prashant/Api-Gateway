const express = require('express')
const rateLimit = require('express-rate-limit')
const { createProxyMiddleware } = require('http-proxy-middleware');
const {serverConfig} = require('./config')
const apiRoutes = require('./routes')
const app = express()

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	limit: 3, // Limit each IP to 3 requests per `window` (here, per 15 minutes).
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(limiter)

app.use(
    '/flightsService',
    createProxyMiddleware({
      target: serverConfig.FLIGHT_SERVICE,
      changeOrigin: true,
    }),
  );
app.use(
    '/bookingService',
    createProxyMiddleware({
      target: serverConfig.BOOKING_SERVICE,
      changeOrigin: true,
      pathRewrite: {'^/bookingService' : '/'}
    }),
  );

app.use('/api', apiRoutes)

app.listen(serverConfig.PORT, ()=>{
    console.log(`Server started on server PORT : ${serverConfig.PORT}`);
})