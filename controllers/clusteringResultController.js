const { ClusteringResult } = require('../models');
const factory = require('./handlerFactory');

exports.getAllClusteringResult = factory.findAll(ClusteringResult);
exports.createClusteringResult = factory.createOne(ClusteringResult);
exports.getClusteringResult = factory.findOne(ClusteringResult);
exports.updateClusteringResult = factory.updateOne(ClusteringResult);
exports.deleteClusteringResult = factory.deleteOne(ClusteringResult);
