const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const kecelakaanRouter = require('./routes/kecelakaanRoutes');
const wisatawanRouter = require('./routes/wisatawanRoutes');
const cuacaRouter = require('./routes/cuacaRoutes');
const viewRouter = require('./routes/viewRoutes');
const clusteringRouter = require('./routes/clusteringRoutes');
const clusteringResultRouter = require('./routes/clusteringResultRoutes');

// Start express app
const app = express();

// Implement CORS
app.use(cors());
app.options('*', cors());

// Using pug view engine
app.set('view engine', 'pug');

//  Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/', viewRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/kecelakaan', kecelakaanRouter);
app.use('/api/v1/wisatawan', wisatawanRouter);
app.use('/api/v1/cuaca', cuacaRouter);
app.use('/api/v1/clustering', clusteringRouter);
app.use('/api/v1/clustering-result', clusteringResultRouter);

// Not Found Routes
app.all('*', (req, res, next) => {
  // next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));

  res.status(200).render('error-404', {
    title: 'Pages Not Found',
    url: req.originalUrl,
  });
});

// ? Error Handler/Middleware
app.use(globalErrorHandler);

module.exports = app;
