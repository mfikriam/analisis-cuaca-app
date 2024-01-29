const { Wisatawan } = require('../models');
const factory = require('./handlerFactory');

exports.getAllWisatawan = factory.findAll(Wisatawan);
exports.createWisatawan = factory.createOne(Wisatawan);
exports.getWisatawan = factory.findOne(Wisatawan);
exports.updateWisatawan = factory.updateOne(Wisatawan);
exports.deleteWisatawan = factory.deleteOne(Wisatawan);

exports.getWisatawanUser = factory.getUser(Wisatawan);
exports.createManyWisatawan = factory.createMany(Wisatawan);
exports.deleteAllWisatawan = factory.deleteAll(Wisatawan);
