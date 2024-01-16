const { DataTypes } = require('sequelize');

const kecelakaanSchema = {
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Tanggal must be a valid date.',
      },
    },
  },
  jum_kecelakaan: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Jum kecelakaan must be an integer.',
      },
      min: {
        args: [0],
        msg: 'Jum kecelakaan minimum 0',
      },
    },
  },
};

module.exports = kecelakaanSchema;
