const { User } = require('../models');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllUsers = factory.findAll(User);
exports.createUser = factory.createOne(User);
exports.getUser = factory.findOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.createAdmin = catchAsync(async (req, res, next) => {
  let dataObj;
  if (req.params.type === 'test') {
    dataObj = {
      email: 'test@gmail.com',
      password: 'test123',
      fullname: 'Test Akun',
    };
  } else if (req.params.type === 'super') {
    dataObj = {
      email: 'admin@gmail.com',
      password: 'admin123',
      fullname: 'Admin Account',
    };
  }

  if (dataObj) {
    const resultQuery = await User.create(dataObj);

    res.status(201).json({
      status: 'success',
      data: { user: resultQuery.toJSON() },
    });
  } else {
    return next(new AppError('Wrong params!', 400));
  }
});
