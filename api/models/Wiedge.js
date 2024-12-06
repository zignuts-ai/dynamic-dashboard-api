const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");
const { models } = require("../../config/models");
const { STATUS } = require("../../config/constants");
const Dashboard = require("./Dashboard");

const Wiedge = sequelize.define(
    "Wiedge",
    {
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        prompt: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        queryString: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        dataStoreId: {
            type: DataTypes.STRING(40),

            allowNull: false,
        },
        organisationId: {
            type: DataTypes.STRING(40),

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
        dashboardId: {
            type: DataTypes.STRING(40),

            allowNull: false,
        },
        ...models.defaultAttributes,
    },

    {
        tableName: "wiedge",
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = Wiedge;
