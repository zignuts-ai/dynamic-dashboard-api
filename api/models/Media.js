const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/sequelize');
const { models } = require('../../config/models');
const { STATUS } = require('../../config/constants');

const Media = sequelize.define(
  'Media',
  {
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING(255),
      field: 'file_name',
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING(255),
      field: 'file_path',
      allowNull: true,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    contentType: {
      type: DataTypes.STRING(128),
      field: 'content_type',
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING(255),
      field: 'original_name',
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: STATUS.MEDIA.UPLOADED,
    },
    isConverted: {
      type: DataTypes.BOOLEAN,
      field: 'is_converted',
      allowNull: false,
      defaultValue: false,
    },
    mediaType: {
      type: DataTypes.STRING(15),
      field: 'media_type',
      allowNull: false,
    },
    convertedSize: {
      type: DataTypes.INTEGER,
      field: 'converted_size',
      allowNull: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      field: 'is_public',
      defaultValue: true,
    },
    ...models.defaultAttributes,
  },

  {
    tableName: 'media',
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Media;
