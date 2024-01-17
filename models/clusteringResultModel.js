const { DataTypes } = require('sequelize');

const clusteringResultSchema = {
  cluster: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
};

module.exports = clusteringResultSchema;
