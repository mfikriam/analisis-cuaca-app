const { DataTypes } = require('sequelize');

const wisatawanSchema = {
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'tanggal must be a valid date.',
      },
    },
  },
  jum_wisnus: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Jum wisnus must be an integer.',
      },
      min: {
        args: [0],
        msg: 'Jum wisnus minimum 0',
      },
    },
  },
  jum_wisman: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'Jum wisman must be an integer.',
      },
      min: {
        args: [0],
        msg: 'Jum wisman minimum 0',
      },
    },
  },
};

module.exports = wisatawanSchema;
