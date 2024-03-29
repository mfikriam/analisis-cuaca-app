const { ClusteringResult, Clustering } = require('../models');
const factory = require('./handlerFactory');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllClusteringResult = factory.findAll(ClusteringResult);
exports.createClusteringResult = factory.createOne(ClusteringResult);
exports.getClusteringResult = factory.findOne(ClusteringResult);
exports.updateClusteringResult = factory.updateOne(ClusteringResult);
exports.deleteClusteringResult = factory.deleteOne(ClusteringResult);

exports.createManyClusteringResult = factory.createMany(ClusteringResult);

exports.getAllClusteringResultByClusteringId = catchAsync(async (req, res, next) => {
  const { clusteringId } = req.params;
  const clustering = await Clustering.findByPk(clusteringId);

  if (!clustering) {
    return next(new AppError(`Cannot find ${Clustering.name} with ID=${clusteringId}`, 404));
  }

  const resultQuery = await ClusteringResult.findAll({
    where: { clustering_id: clusteringId },
  });
  const resultQueryArr = await Promise.all(
    resultQuery.map(async (instance) => {
      const cuaca = (await instance.getCuaca()).toJSON();
      return {
        ...instance.toJSON(),
        cuaca,
      };
    }),
  );

  res.status(200).json({
    status: 'success',
    results: resultQueryArr.length,
    data: {
      [`${Clustering.name}`]: clustering.toJSON(),
      [`${ClusteringResult.name}s`]: resultQueryArr,
    },
  });
});

exports.deleteClusteringResultByClusteringId = catchAsync(async (req, res, next) => {
  const { clusteringId } = req.params;
  const clustering = await Clustering.findByPk(clusteringId);

  if (!clustering) {
    return next(new AppError(`Cannot find ${Clustering.name} with ID=${clusteringId}`, 404));
  }

  await ClusteringResult.destroy({ where: { clustering_id: clusteringId } });

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.updateClusteringResultClusterByClusteringId = catchAsync(async (req, res, next) => {
  const { clusteringId, oldCluster } = req.params;

  await ClusteringResult.update(req.body, {
    where: { clustering_id: clusteringId, cluster: oldCluster },
  });

  const resultQuery = await ClusteringResult.findAll({
    where: { clustering_id: clusteringId },
  });
  const resultQueryArr = await Promise.all(
    resultQuery.map(async (instance) => {
      const cuaca = (await instance.getCuaca()).toJSON();
      return {
        ...instance.toJSON(),
        cuaca,
      };
    }),
  );

  res.status(200).json({
    status: 'success',
    data: { [`${ClusteringResult.name}s`]: resultQueryArr },
  });
});
