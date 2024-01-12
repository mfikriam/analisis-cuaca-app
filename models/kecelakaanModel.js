const { DataTypes } = require('sequelize');

const kecelakaanSchema = {
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  jum_kecelakaan: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

module.exports = kecelakaanSchema;
