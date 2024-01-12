const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRoutes');

// Start express app
const app = express();

// Implement CORS
app.use(cors());
app.options('*', cors());

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
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my application.' });
});
app.use('/api/v1/users', userRouter);

module.exports = app;
