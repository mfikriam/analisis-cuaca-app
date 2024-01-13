const { DataTypes } = require('sequelize');

const kecelakaanSchema = {
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'tanggal must be a valid date.',
      },
    },
  },
  jum_kecelakaan: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'jum_kecelakaan must be an integer.',
      },
    },
  },
};

module.exports = kecelakaanSchema;
