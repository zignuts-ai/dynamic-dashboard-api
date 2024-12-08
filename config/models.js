const { DataTypes } = require("./constants");

module.exports.models = {
  defaultAttributes: {
    id: {
      type: DataTypes.STRING(40),
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
    },
    createdAt: {
      type: DataTypes.BIGINT,
      defaultValue: () => Math.floor(Date.now() / 1000),
      field: "created_at",
    },
    createdBy: {
      type: DataTypes.STRING(40),
      allowNull: true,
      field: 'created_by',
    },
    updatedAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: () => Math.floor(Date.now() / 1000),
      field: 'updated_at',
    },
    updatedBy: {
      type: DataTypes.STRING(40),
      allowNull: true,
      field: "updated_by",
    },
    deletedAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "deleted_at",
    },
    deletedBy: {
      type: DataTypes.STRING(40),
      allowNull: true,
      field: "deleted_by",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_deleted",
    },
  },
};
