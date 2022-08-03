var db = require("../../database/models");
const ContentType = db.contentType;
const ContentTypeFields = db.contentTypeFields;
const { DataTypes, QueryTypes } = require("sequelize");
const { uuid } = require("uuidv4");
const queryInterface = db.sequelize.getQueryInterface();

exports.getDbNameContentType = async (id) => {
  const contentType = await ContentType.findOne({
    where: { id },
  });
  return contentType.name;
};
exports.findAndCountContentTypes = async () => {
  const { count, rows } = await ContentType.findAndCountAll({
    order: [["createdAt", "DESC"]],
  });
  return { count, rows };
};

exports.createContentTypeService = async (contentTypeRecord) => {
  return await ContentType.create(contentTypeRecord);
};

exports.addContentTypeFieldService = async (contentTypeFieldsRecord) => {
  return await ContentTypeFields.create(contentTypeFieldsRecord);
};

exports.updateContentType = async (dataToUpdate, id) => {
  await ContentType.update(dataToUpdate, { where: { id } });
};

exports.deleteContentType = async (id) => {
  await ContentType.destroy({ where: { id, deletedAt: null } });
};

exports.createNewContentEntriesDb = async (name) => {
  const newTable = db.sequelize.define(
    `${name}_entries`,
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    { timestamps: false }
  );

  newTable.beforeValidate(async (entry, options) => {
    entry.id = uuid();
  });

  await newTable.sync();
};

exports.renameEntriesDb = async (oldName, newName) => {
  queryInterface.renameTable(oldName, newName);
};

exports.getAllColumnContentTypeDb = async (contentTypeId) => {
  const { count, rows } = await ContentTypeFields.findAndCountAll({
    where: { contentTypeId },
  });
  return { count, rows };
};

exports.getAllEntries = async (dbName) => {
  const tableName = `${dbName}_entries`;
  const rows = await db.sequelize.query(`SELECT * FROM ${tableName}`, {
    type: QueryTypes.SELECT,
  });
  const count = await db.sequelize.query(`SELECT COUNT(*) FROM ${tableName}`, {
    type: QueryTypes.SELECT,
  });
  return { rows, count: count[0].count };
};

exports.addColumnContentEntriesDb = async (dbName, column, type) => {
  queryInterface.addColumn(`${dbName}_entries`, column, { type });
};

exports.addEntries = async (dbName, insertRecord) => {
  return await queryInterface.bulkInsert(
    `${dbName}_entries`,
    [{ id: uuid(), ...insertRecord }],
    {}
  );
};

exports.deleteEntry = async (dbName, id) => {
  return await queryInterface.bulkDelete(`${dbName}_entries`, { id });
};
