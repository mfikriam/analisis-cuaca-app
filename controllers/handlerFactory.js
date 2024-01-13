const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const resObj = { data: {} };
    resObj.status = 'success';
    resObj.data[Model.name] = await Model.create(req.body);

    res.status(201).json(resObj);
  });

exports.findAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const resultQuery = await Model.findAll();

    const resObj = { data: {} };
    resObj.status = 'success';
    resObj.results = resultQuery.length;
    resObj.data[`${Model.name}s`] = resultQuery;

    res.status(200).json(resObj);
  });

exports.findOne = (Model, fk, attr) =>
  catchAsync(async (req, res, next) => {
    let resultQuery;

    if (fk) {
      resultQuery = await Model.findByPk(req.params.id, {
        include: [
          {
            model: fk,
            attributes: attr,
          },
        ],
      });
    } else {
      resultQuery = await Model.findByPk(req.params.id);
    }

    if (!resultQuery) {
      return next(new AppError(`Cannot find ${Model.name} with ID=${req.params.id}`, 404));
    }

    const resObj = { data: {} };
    resObj.status = 'success';
    resObj.data[Model.name] = resultQuery;

    res.status(200).json(resObj);
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const resultQuery = await Model.findByPk(req.params.id);

    if (!resultQuery) {
      return next(new AppError(`Cannot find ${Model.name} with ID=${req.params.id}`, 404));
    }

    await Model.update(req.body, { where: { id: req.params.id } });

    const resObj = { data: {} };
    resObj.status = 'success';
    resObj.data[Model.name] = resultQuery;

    res.status(200).json(resObj);
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const resultQuery = await Model.findByPk(req.params.id);

    if (!resultQuery) {
      return next(new AppError(`Cannot find ${Model.name} with ID=${req.params.id}`, 404));
    }

    await Model.destroy({ where: { id: req.params.id } });

    const resObj = { data: null };
    resObj.status = 'success';

    res.status(204).json(resObj);
  });
