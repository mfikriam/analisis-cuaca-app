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
    get() {
      return this.getDataValue('favColors').split(';');
    },
    set(val) {
      this.setDataValue('favColors', val.join(';'));
    },
  },
};

module.exports = clusteringSchema;
