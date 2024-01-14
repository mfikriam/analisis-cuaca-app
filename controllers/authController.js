const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { User } = require('../models');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  console.log('Date: ', cookieOptions.expires);

  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // ? Remove password from output
  delete user.dataValues.password;
  delete user.dataValues.createdAt;
  delete user.dataValues.updatedAt;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // ? 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // ? 2) Check if user exists && password is correct
  const user = await User.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  // ? 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // ? 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // ? 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // ? 3) Check if user still exists
  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  //// 4) Check if user changed password after the token was issued

  // ? Remove password from output
  delete currentUser.dataValues.password;
  delete currentUser.dataValues.createdAt;
  delete currentUser.dataValues.updatedAt;

  // ? Grant Access to protected route
  req.user = currentUser.dataValues;
  res.locals.user = currentUser.dataValues;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

//? Only for render pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      //? 1) Verify token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

      //? 2) Check if user still exists
      const currentUser = await User.findByPk(decoded.id);
      if (!currentUser) {
        return res.redirect('/login');
      }

      //// 3) Check if user changed password after the token was issued

      // ? Remove password from output
      delete currentUser.dataValues.password;
      delete currentUser.dataValues.createdAt;
      delete currentUser.dataValues.updatedAt;

      //? THERE IS A LOGGED IN USER
      res.locals.user = currentUser.dataValues;
      return next();
    } catch (err) {
      //! Should be error page
      // return next(new AppError('There is something wrong with the coookies', 400));
      return next();
    }
  }

  return res.redirect('/login');
};

exports.isNotLoggedIn = async (req, res, next) => {
  console.log(req.cookies);
  if (!req.cookies.jwt || req.cookies.jwt === 'loggedout') {
    return next();
  }

  return res.redirect('/dashboard');
};
