// const AppError = require('../utils/appError');

const handleValidationErrorDB = (err, res) => {
  const message = 'Invalid input data';
  const validationError = err.errors.map((el) => {
    return { field: el.path, message: el.message, value: el.value };
  });

  return res.status(400).json({
    status: 'fail',
    statusCode: 400,
    message,
    validationError,
  });
};

// const handleJWTError = () => new AppError('Invalid token. Plase log in again!', 401);

// const handleJWTExpiredError = () =>
//   new AppError('Your token has expired!. Plase log in again!', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // console.log(err);
  // console.log('Error Name: ', err.name);
  // console.log(err.errors);
  // console.log(err.errors[0].message);
  // console.log(err.stack);

  if (err.name === 'SequelizeUniqueConstraintError' || err.name === 'SequelizeValidationError') {
    handleValidationErrorDB(err, res);
  }
  // if (error.name === 'JsonWebTokenError') error = handleJWTError();
  // if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  return res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    // stack: err.stack,
  });
};
