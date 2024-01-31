const { Cuaca } = require('../models');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

exports.getAllCuaca = factory.findAll(Cuaca);
exports.createCuaca = factory.createOne(Cuaca);
exports.getCuaca = factory.findOne(Cuaca);
exports.updateCuaca = factory.updateOne(Cuaca);
exports.deleteCuaca = factory.deleteOne(Cuaca);

exports.getCuacaUser = factory.getUser(Cuaca);
exports.createManyCuaca = factory.createMany(Cuaca);
exports.deleteAllCuaca = factory.deleteAll(Cuaca);

exports.getAllCuacaByUserId = catchAsync(async (req, res, next) => {
  const resultQuery = await Cuaca.findAll({
    where: {
      user_id: req.params.userId,
    },
  });
  const resultQueryArr = resultQuery.map((instance) => instance.dataValues);

  res.status(200).json({
    status: 'success',
    results: resultQueryArr.length,
    data: { cuacas: resultQueryArr },
  });
});
