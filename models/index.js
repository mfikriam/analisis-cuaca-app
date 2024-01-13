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

const User = sequelize.define('user', userSchema, {
  underscored: true,
});
const Kecelakaan = sequelize.define('kecelakaan', kecelakaanSchema, {
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['tanggal', 'user_id'],
    },
  ],
});

User.hasMany(Kecelakaan);
Kecelakaan.belongsTo(User, {
  foreignKey: {
    name: 'user_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

module.exports = { sequelize, User, Kecelakaan };
