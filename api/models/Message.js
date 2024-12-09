const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");
const { models } = require("../../config/models");
const User = require("./User");
const Session = require("./Session");

const Message = sequelize.define(
  "Message",
  {
    type: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    messageNews: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    // sessionId: {
    //   type: DataTypes.STRING(40),
    //   references: {
    //     model: Session,
    //     key: 'id',
    //   },
    //   allowNull: false,
    //   field: 'sessionId',
    // },
    sessionId: {
      type: DataTypes.STRING(40),
      references: {
        model: Session,
        key: "id",
      },
      allowNull: false,
      field: "sessionId",
    },
    userId: {
      type: DataTypes.STRING(40),
      references: {
        model: User,
        key: "id",
      },
      allowNull: true,
      field: "userId",
    },
    ...models.defaultAttributes,
  },
  {
    tableName: "messages",
    freezeTableName: true,
    timestamps: true,
  }
);

// Define relationships
User.hasMany(Message, { foreignKey: "userId" });
Message.belongsTo(User, { foreignKey: "userId" });

Session.hasMany(Message, { foreignKey: "sessionId" });
Message.belongsTo(Session, { foreignKey: "sessionId" });

module.exports = Message;
