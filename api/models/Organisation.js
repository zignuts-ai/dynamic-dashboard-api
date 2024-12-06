const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");
const { models } = require("../../config/models");
const { STATUS } = require("../../config/constants");
const User = require("./User");
const UserOragnisationMap = require("./UserOragnisationMap");

const Organisation = sequelize.define(
    "Organisation",
    {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        adminId: {
            type: DataTypes.STRING(40),

            allowNull: false,

        },
        userOrganisationMapId: {
            type: DataTypes.STRING(40),

            allowNull: false,

        },
        ...models.defaultAttributes,
    },

    {
        tableName: "organisation",
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = Organisation;
