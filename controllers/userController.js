const User = require('../models/userModel');
const factory = require('./handlerFactory');

exports.getAllUsers = factory.findAll(User);
exports.createUser = factory.createOne(User);
exports.getUser = factory.findOne(User);
// exports.getUser = factory.findOne(User, { path: 'reviews' });
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
