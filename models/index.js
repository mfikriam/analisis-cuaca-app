const { Sequelize } = require('sequelize');
const userSchema = require('./userModel');
const kecelakaanSchema = require('./kecelakaanModel');
const wisatawanSchema = require('./wisatawanModel');

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
    logging: false,
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

const Wisatawan = sequelize.define('wisatawan', wisatawanSchema, {
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['tanggal', 'user_id'],
    },
  ],
});

// Associations
User.hasMany(Kecelakaan);
User.hasMany(Wisatawan);
Kecelakaan.belongsTo(User, {
  foreignKey: {
    name: 'user_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});
Wisatawan.belongsTo(User, {
  foreignKey: {
    name: 'user_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

module.exports = { sequelize, User, Kecelakaan, Wisatawan };
