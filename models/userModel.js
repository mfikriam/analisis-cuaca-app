const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const userSchema = {
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
};

const User = sequelize.define('user', userSchema);

module.exports = User;
