var express = require("express");
var router = express.Router();
var contentTypeController = require("../controllers/contentType.controller");
const { isAuthenticate } = require("../utils/jwt");

router.get("/", isAuthenticate, contentTypeController.getAllContentType);

router.post("/", isAuthenticate, contentTypeController.createContentType);

router.post(
  "/field/:id",
  isAuthenticate,
  contentTypeController.addFieldContentType
);

router.get(
  "/field/:id",
  isAuthenticate,
  contentTypeController.getFieldsContentType
);

router.get("/entry/:id", isAuthenticate, contentTypeController.getAllEntry);

router.post(
  "/entry/:id",
  isAuthenticate,
  contentTypeController.addEntryContentType
);

router.delete(
  "/entry/:id",
  isAuthenticate,
  contentTypeController.deleteEntryContentType
);

router.put("/:id", isAuthenticate, contentTypeController.editContentType);

module.exports = router;
