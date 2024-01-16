const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const kecelakaanRouter = require('./routes/kecelakaanRoutes');
const wisatawanRouter = require('./routes/wisatawanRoutes');
const cuacaRouter = require('./routes/cuacaRoutes');
const viewRouter = require('./routes/viewRoutes');

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

// ROUTES
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/kecelakaan', kecelakaanRouter);
app.use('/api/v1/wisatawan', wisatawanRouter);
app.use('/api/v1/cuaca', cuacaRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ? Error Handler/Middleware
app.use(globalErrorHandler);

module.exports = app;
