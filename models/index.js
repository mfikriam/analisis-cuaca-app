const { Sequelize } = require('sequelize');
const userSchema = require('./userModel');
const kecelakaanSchema = require('./kecelakaanModel');
const wisatawanSchema = require('./wisatawanModel');
const cuacaSchema = require('./cuacaModel');
const clusteringSchema = require('./clusteringModel');
const clusteringResultSchema = require('./clusteringResultModel');

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

const Cuaca = sequelize.define('cuaca', cuacaSchema, {
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['tanggal', 'user_id'],
    },
  ],
});

const Clustering = sequelize.define('clustering', clusteringSchema, {
  underscored: true,
});

const ClusteringResult = sequelize.define('clustering_result', clusteringResultSchema, {
  underscored: true,
});

// Associations
User.hasMany(Kecelakaan);
User.hasMany(Cuaca);
User.hasMany(Wisatawan);
User.hasMany(Clustering);

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
Cuaca.belongsTo(User, {
  foreignKey: {
    name: 'user_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});
Clustering.belongsTo(User, {
  foreignKey: {
    name: 'user_id',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Clustering.belongsToMany(Cuaca, { through: ClusteringResult });
Cuaca.belongsToMany(Clustering, { through: ClusteringResult });

module.exports = { sequelize, User, Kecelakaan, Wisatawan, Cuaca, Clustering, ClusteringResult };
