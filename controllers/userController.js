// const { Op } = require('sequelize');
const User = require('../models/userModel');

exports.create = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error,
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: `Cannot find User with id=${userId}`,
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: `Cannot find User with id=${userId}`,
      });
      return;
    }

    await User.update(req.body, { where: { id: userId } });

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: `Cannot find User with id=${userId}`,
      });
      return;
    }

    await User.destroy({ where: { id: userId } });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error,
    });
  }
};
