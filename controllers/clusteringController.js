const { Clustering } = require('../models');
const factory = require('./handlerFactory');

exports.getAllClustering = factory.findAll(Clustering);
exports.createClustering = factory.createOne(Clustering);
exports.getClustering = factory.findOne(Clustering);
exports.updateClustering = factory.updateOne(Clustering);
exports.deleteClustering = factory.deleteOne(Clustering);

exports.getClusteringUser = factory.getUser(Clustering);
exports.createManyClustering = factory.createMany(Clustering);
exports.deleteAllClustering = factory.deleteAll(Clustering);
