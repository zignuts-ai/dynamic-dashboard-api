const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");
const { models } = require("../../config/models");
const { STATUS } = require("../../config/constants");

const DataStore = sequelize.define(
    "DataStore",
    {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        title: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        connection_string: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        db_name: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        db_host: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        db_port: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        db_username: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        db_password: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        db_type: {
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
        ...models.defaultAttributes,
    },

    {
        tableName: "dataStore",
        freezeTableName: true,
        timestamps: false,
    }
);


module.exports = DataStore;
