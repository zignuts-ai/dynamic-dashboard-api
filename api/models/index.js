const { sequelize } = require('../../config/sequelize');

const User = require('./User');
const Admin = require('./Admin');


module.exports = {
  User,
  Admin,
  sequelize,
};
