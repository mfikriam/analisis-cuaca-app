// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

exports.getHomePage = (req, res) => {
  res.redirect('/dashboard');
};

exports.getDashboardPage = (req, res) => {
  res.status(200).render('dashboard', {
    title: 'Dashboard',
    bread_crumbs: ['Dashboard'],
  });
};

exports.getBlankPage = (req, res) => {
  res.status(200).render('blank', {
    title: 'Blank Page',
    bread_crumbs: ['Blank'],
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};
