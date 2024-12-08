const { sequelize } = require('../../config/sequelize');

const User = require('./User');
const Admin = require('./Admin');
const Message = require('./Message');
const Session = require('./Session');


module.exports = {
  User,
  Admin,
  Session,
  Message,
  sequelize,
};
