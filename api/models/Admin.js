const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/sequelize');
const { models } = require('../../config/models');

const Admin = sequelize.define(
  'Admin',
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    lastLogoutAt: {
      type: DataTypes.BIGINT,
      field: 'last_logout_at',
    },
    ...models.defaultAttributes,
  },

  {
    tableName: 'admin',
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Admin;
