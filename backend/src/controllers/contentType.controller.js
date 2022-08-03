var logger = require("../utils/logger");
const { getUserByEmail } = require("../services/user.service");
const {
  createContentTypeService,
  updateContentType,
  findAndCountContentTypes,
  addContentTypeFieldService,
  createNewContentEntriesDb,
  getDbNameContentType,
  addColumnContentEntriesDb,
  renameEntriesDb,
  addEntries,
  getAllColumnContentTypeDb,
  getAllEntries,
  deleteEntry,
} = require("../services/contentType.service");

exports.getAllContentType = async (req, res, next) => {
  try {
    logger.info("Executing getAllContentType controller");
    const { count, rows } = await findAndCountContentTypes();
    res.status(200).send({ count, rows });
  } catch (err) {
    logger.error(err);
    res.status(401).send({ message: err.message });
  }
};

exports.createContentType = async (req, res, next) => {
  try {
    logger.info("Executing createContentType controller");

    const { name } = req.body;
    const { email } = res.locals;
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).send({ message: "User does not exist" });
    logger.info("Creating content type");

    const createdContentType = await createContentTypeService({
      name,
      createdBy: user.id,
    });
    await createNewContentEntriesDb(name);
    res.status(200).send({ createdContentType });
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: err.message });
  }
};

exports.editContentType = async (req, res, next) => {
  try {
    logger.info("Executing editContentType controller");
    const id = req.params.id;
    const { name } = req.body;
    const oldName = await getDbNameContentType(id);
    const updated = await updateContentType({ name }, id);
    renameEntriesDb(`${oldName}_entries`, `${name}_entries`);
    res.status(200).send({ updated });
  } catch (err) {
    logger.error(err);
    res.status(401).send({ message: err.message });
  }
};

exports.getFieldsContentType = async (req, res, next) => {
  try {
    logger.info("Executing getFieldsContentType controller");
    const id = req.params.id;
    const { count, rows } = await getAllColumnContentTypeDb(id);
    res.status(200).send({ count, rows });
  } catch (err) {
    logger.error(err);
    res.status(401).send({ message: err.message });
  }
};
exports.getAllEntry = async (req, res, next) => {
  try {
    logger.info("Executing getAllEntry controller");
    const id = req.params.id;
    const dbName = await getDbNameContentType(id);
    const { rows, count } = await getAllEntries(dbName);
    res.status(200).send({ rows, count });
  } catch (err) {
    logger.error(err);
    res.status(401).send({ message: err.message });
  }
};

exports.addFieldContentType = async (req, res, next) => {
  try {
    logger.info("Executing addFieldContentType controller");
    const id = req.params.id;
    const { fieldName, fieldType } = req.body;
    const createdContentTypeField = await addContentTypeFieldService({
      fieldName,
      fieldType,
      contentTypeId: id,
    });

    const dbName = await getDbNameContentType(id);
    await addColumnContentEntriesDb(dbName, fieldName, fieldType);
    res.status(200).send({ createdContentTypeField });
  } catch (err) {
    logger.error(err);
    res.status(401).send({ message: err.message });
  }
};

exports.addEntryContentType = async (req, res, next) => {
  try {
    logger.info("Executing addEntryContentType controller");
    const id = req.params.id;
    const dbName = await getDbNameContentType(id);

    const insertRecord = req.body;
    const createdContentTypeField = await addEntries(dbName, insertRecord);

    res.status(200).send({ createdContentTypeField });
  } catch (err) {
    logger.error(err);
    res.status(401).send({ message: err.message });
  }
};

exports.deleteEntryContentType = async (req, res, next) => {
  try {
    logger.info("Executing deleteEntryContentType controller");
    const id = req.params.id;
    const { contentTypeId } = req.body;
    const dbName = await getDbNameContentType(contentTypeId);
    await deleteEntry(dbName, id);

    res.status(200).send({ message: "OK" });
  } catch (err) {
    logger.error(err);
    res.status(401).send({ message: err.message });
  }
};
