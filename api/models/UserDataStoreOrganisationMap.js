const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/sequelize");
const { models } = require("../../config/models");
const { STATUS } = require("../../config/constants");

const UserDataStoreOrganisationMap = sequelize.define(
    "UserDataStoreOrganisationMap",
    {

        userId: {
            type: DataTypes.STRING(40),

            allowNull: false,

        },
        organisationId: {
            type: DataTypes.STRING(40),

            allowNull: false,

        },
        dataStoreId: {
            type: DataTypes.STRING(40),

            allowNull: false,

        },
        ...models.defaultAttributes,
    },

    {
        tableName: "userDataStoreOrganisationMap",
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = UserDataStoreOrganisationMap;
