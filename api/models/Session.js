const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/sequelize'); // Get your DB instance
const { models } = require('../../config/models');
const User = require('./User');

const Session = sequelize.define(
  'Session',
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // time: {
    //   type: DataTypes.BIGINT, 
    //   allowNull: true, 
    // },
    userId: {
      type: DataTypes.STRING(40),
      allowNull: true, 
    },
    sessionId: {
      type: DataTypes.STRING(40),
      allowNull: true, 
    },
    news: {
      type: DataTypes.JSON,
      allowNull: true, 
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // userId: {
    //     type: DataTypes.STRING(40),
    //     references: {
    //         model: User,
    //         key: "id", // Primary key of the User table
    //     },
    //     allowNull: false,
    //     field: "userId",
    // },
    ...models.defaultAttributes,
  },
  {
    // timestamps: true,
    tableName: 'sessions',
    freezeTableName: true,
    timestamps: false,
  }
);
// Define the association between User and Session
// User.hasMany(Session, { foreignKey: 'userId' });
// Session.belongsTo(User, { foreignKey: 'userId' });

module.exports = Session;
