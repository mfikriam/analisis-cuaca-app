const { Sequelize } = require('sequelize');
const userSchema = require('./userModel');
const kecelakaanSchema = require('./kecelakaanModel');

// Connect to Database
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    define: {
      freezeTableName: true,
    },
  },
);

const User = sequelize.define('users', userSchema, {
  underscored: true,
});
const Kecelakaan = sequelize.define('kecelakaan', kecelakaanSchema, {
  underscored: true,
});

User.hasMany(Kecelakaan);
Kecelakaan.belongsTo(User);

module.exports = { sequelize, User, Kecelakaan };
