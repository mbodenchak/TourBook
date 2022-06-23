const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

// GLOBAL MIDDLEWARES
//Set security HTTP headers
app.use(helmet());

//Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);
//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
//Serving static files
app.use(express.static(`${__dirname}/public`));

//Test middleware - logs type of request and time sent .e.g: GET /api/v1/tours?duration=5&difficulty=easy 200 111.466 ms - 9387
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

/// Unhandled routes middleware.
app.all('*', (res, req, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
