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
};

module.exports = clusteringSchema;
