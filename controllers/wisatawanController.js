const { Wisatawan } = require('../models');
const factory = require('./handlerFactory');

exports.getAllWisatawan = factory.findAll(Wisatawan);
exports.createWisatawan = factory.createOne(Wisatawan);
exports.getWisatawan = factory.findOne(Wisatawan);
exports.updateWisatawan = factory.updateOne(Wisatawan);
exports.deleteWisatawan = factory.deleteOne(Wisatawan);
