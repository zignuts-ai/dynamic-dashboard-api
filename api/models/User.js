const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/sequelize'); // Get your DB instance
const { models } = require('../../config/models');

const User = sequelize.define(
  'User',
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    forgotPasswordToken: {
      type: DataTypes.STRING(40),
      field: 'forgot_password_token',
      allowNull: true,
    },
    forgotPasswordTokenExpiry: {
      type: DataTypes.INTEGER,
      field: 'forgot_password_token_expiry',
      allowNull: true,
    },
    lastLoginAt: {
      type: DataTypes.BIGINT,
      field: 'last_login_at',
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    countryCode: {
      type: DataTypes.STRING(5),
      field: 'country_code',
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    lastLogoutAt: {
      type: DataTypes.BIGINT,
      field: 'last_logout_at',
    },
    ...models.defaultAttributes,
  },
  {
    // timestamps: true,
    tableName: 'user',
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = User;
