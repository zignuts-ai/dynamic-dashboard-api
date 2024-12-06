const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/sequelize');
const { models } = require('../../config/models');
const { STATUS } = require('../../config/constants');

const Dashboard = sequelize.define(
    'Dashboard',
    {
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING(40),

            allowNull: false,

        },
        organisationId: {
            type: DataTypes.STRING(40),

            allowNull: false,

        },
        ...models.defaultAttributes,
    },

    {
        tableName: 'dashboard',
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = Dashboard;
