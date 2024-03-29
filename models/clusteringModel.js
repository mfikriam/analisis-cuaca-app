const { DataTypes } = require('sequelize');

const clusteringSchema = {
  jum_cluster: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Jum cluster must be an integer.',
      },
      min: {
        args: [2],
        msg: 'Jum cluster minimum 2',
      },
    },
  },
  jum_percobaan: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Jum percobaan must be an integer.',
      },
      min: {
        args: [1],
        msg: 'Jum percobaan minimum 1',
      },
    },
  },
  kriteria_clustering: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: 'Kriteria clustering cannot be empty',
      },
    },
  },
  centroids: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  num_of_iterations: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inertia: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
};

module.exports = clusteringSchema;
