const { DataTypes } = require('sequelize');

const cuacaSchema = {
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Tanggal must be a valid date.',
      },
    },
  },
  temperatur_avg: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        msg: 'Avg temperatur must be a float number.',
      },
    },
  },
  kelembaban_avg: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        msg: 'Avg kelembaban must be a float number.',
      },
      min: {
        args: [0],
        msg: 'Avg kelembaban minimum 0',
      },
    },
  },
  kecepatan_angin_avg: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        msg: 'Avg kecepatan angin must be a float number.',
      },
      min: {
        args: [0],
        msg: 'Avg kecepatan angin minimum 0',
      },
    },
  },
  jum_curah_hujan: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        msg: 'Jum curah hujan must be a float number.',
      },
      min: {
        args: [0],
        msg: 'Jum curah hujan minimum 0',
      },
    },
  },
  jum_hari_hujan: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Jum hari hujan must be an integer.',
      },
      min: {
        args: [0],
        msg: 'Jum hari hujan minimum 0',
      },
    },
  },
  penyinaran_matahari_avg: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        msg: 'Avg penyinaran matahari must be a float number.',
      },
      min: {
        args: [0],
        msg: 'Avg penyinaran matahari minimum 0',
      },
    },
  },
};

module.exports = cuacaSchema;
