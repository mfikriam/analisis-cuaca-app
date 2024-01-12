const { DataTypes } = require('sequelize');

const userSchema = {
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        args: true,
        msg: 'Please prove a valid email',
      },
    },
  },
  password: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: {
        args: [7, Infinity],
        msg: 'Password must be at least 7 characters long.',
      },
    },
  },
  fullname: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

module.exports = userSchema;
