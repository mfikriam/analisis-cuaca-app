// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};

exports.getBlankPage = (req, res) => {
  res.status(200).render('blank', {
    title: 'Blank Page',
  });
};
