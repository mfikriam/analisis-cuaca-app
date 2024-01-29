const { Kecelakaan } = require('../models');
const factory = require('./handlerFactory');

exports.getAllKecelakaan = factory.findAll(Kecelakaan);
exports.createKecelakaan = factory.createOne(Kecelakaan);
exports.getKecelakaan = factory.findOne(Kecelakaan);
exports.updateKecelakaan = factory.updateOne(Kecelakaan);
exports.deleteKecelakaan = factory.deleteOne(Kecelakaan);

exports.getKecelakaanUser = factory.getUser(Kecelakaan);
exports.createManyKecelakaan = factory.createMany(Kecelakaan);
exports.deleteAllKecelakaan = factory.deleteAll(Kecelakaan);
