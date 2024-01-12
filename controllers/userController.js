// const { Op } = require('sequelize');
const User = require('../models/userModel');

// Create and Save a new Tutorial
exports.create = (req, res) => {
  const newUser = {
    email: 'test@gmail.com',
    password: 'test123',
  };

  User.create(newUser)
    .then((data) => {
      // res.send(data);
      console.log(data);
      res.status(201).json({
        status: 'success',
        data: {
          user: newUser,
        },
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
  // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({
  //     message: 'Content can not be empty!',
  //   });
  //   return;
  // }
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!',
  });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!',
  });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!',
  });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!',
  });
};
