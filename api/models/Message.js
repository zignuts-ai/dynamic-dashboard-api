const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/sequelize');
const User = require('./User'); 
const Session = require('./Session'); 

const Message = sequelize.define(
  'Message',
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('user_input', 'text', 'image', 'video', 'meme'),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    sessionId: {
      type: DataTypes.INTEGER, 
      references: {
        model: Session,
        key: 'id', 
      },
      allowNull: false,
      field: 'sessionId', 
    },
    userId: {
      type: DataTypes.INTEGER, 
      references: {
        model: User,
        key: 'id', 
      },
      allowNull: false,
      field: 'userId', 
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'messages',
    freezeTableName: true,
    timestamps: true,
  }
);

// Define relationships
User.hasMany(Message, { foreignKey: 'userId' }); 
Message.belongsTo(User, { foreignKey: 'userId' }); 

Session.hasMany(Message, { foreignKey: 'sessionId' }); 
Message.belongsTo(Session, { foreignKey: 'sessionId'});

module.exports = Message;
