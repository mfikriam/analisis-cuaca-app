const { Kecelakaan } = require('../models');
const factory = require('./handlerFactory');

exports.getAllKecelakaans = factory.findAll(Kecelakaan);
exports.createKecelakaan = factory.createOne(Kecelakaan);
exports.getKecelakaan = factory.findOne(Kecelakaan);
// exports.getKecelakaan = factory.findOne(Kecelakaan, { path: 'reviews' });
exports.updateKecelakaan = factory.updateOne(Kecelakaan);
exports.deleteKecelakaan = factory.deleteOne(Kecelakaan);
