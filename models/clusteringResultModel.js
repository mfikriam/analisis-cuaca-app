const { DataTypes } = require('sequelize');

const clusteringResultSchema = {
  clustering_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'clustering',
      key: 'id',
    },
  },
  cuaca_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'cuaca',
      key: 'id',
    },
  },
  cluster: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
};

module.exports = clusteringResultSchema;
