const { User } = require('../models');
const factory = require('./handlerFactory');

exports.getAllUsers = factory.findAll(User);
exports.createUser = factory.createOne(User);
exports.getUser = factory.findOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
