"use strict";
const { Model } = require("sequelize");
const { uuid } = require("uuidv4");
module.exports = (sequelize, DataTypes) => {
  class ContentType extends Model {
    static associate(models) {
      ContentType.belongsTo(models.User, { foreignKey: "createdBy" });
    }
  }
  ContentType.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      name: DataTypes.STRING,
      createdBy: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "ContentType",
    }
  );
  ContentType.beforeCreate((contentType) => {
    contentType.id = uuid();
    contentType.createdAt = new Date();
  });
  return ContentType;
};
