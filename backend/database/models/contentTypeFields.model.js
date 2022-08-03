"use strict";
const { Model } = require("sequelize");
const { uuid } = require("uuidv4");
module.exports = (sequelize, DataTypes) => {
  class ContentTypeFields extends Model {
    static associate(models) {
      ContentTypeFields.belongsTo(models.ContentType, {
        foreignKey: "contentTypeId",
      });
    }
  }
  ContentTypeFields.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      contentTypeId: { type: DataTypes.UUID },
      fieldName: { type: DataTypes.STRING, allowNull: false },
      fieldType: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "ContentTypeFields",
    }
  );
  ContentTypeFields.beforeCreate((contentType) => {
    contentType.id = uuid();
    contentType.createdAt = new Date();
  });
  return ContentTypeFields;
};
