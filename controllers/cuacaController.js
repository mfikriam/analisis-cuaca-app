const { Cuaca } = require('../models');
const factory = require('./handlerFactory');

exports.getAllCuaca = factory.findAll(Cuaca);
exports.createCuaca = factory.createOne(Cuaca);
exports.getCuaca = factory.findOne(Cuaca);
exports.updateCuaca = factory.updateOne(Cuaca);
exports.deleteCuaca = factory.deleteOne(Cuaca);
