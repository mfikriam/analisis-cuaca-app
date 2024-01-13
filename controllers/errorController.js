const AppError = require('../utils/appError');

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

const handleFKConstraintErrorDB = (err) =>
  new AppError(`Invalid input: ${err.table} id is not found. Please insert existed user id!`, 404);

// const handleJWTError = () => new AppError('Invalid token. Plase log in again!', 401);

// const handleJWTExpiredError = () =>
//   new AppError('Your token has expired!. Plase log in again!', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // console.log(err);
  // console.log('\nError Name: ', err.name, '\n');
  // console.log('\nTable Name: ', err.table, '\n');
  // console.log(err.errors);
  // console.log(err.errors[0].message);
  // console.log(err.stack);

  let error = Object.create(err);

  if (
    error.name === 'SequelizeUniqueConstraintError' ||
    error.name === 'SequelizeValidationError'
  ) {
    handleValidationErrorDB(error, res);
    return;
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    error = handleFKConstraintErrorDB(error);
  }
  // if (error.name === 'JsonWebTokenError') error = handleJWTError();
  // if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  return res.status(error.statusCode).json({
    status: error.status,
    statusCode: error.statusCode,
    message: error.message,
    // stack: error.stack,
  });
};