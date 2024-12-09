const { sequelize } = require("../../config/sequelize");

const User = require("./User");
const Message = require("./Message");
const Session = require("./Session");

module.exports = {
  User,
  Session,
  Message,
  sequelize,
};
