var express = require("express");
var router = express.Router();
var userController = require("../controllers/user.controller");
const { isAuthenticate } = require("../utils/jwt");

/* GET user's detail. */
router.get("/", isAuthenticate, userController.getUser);

router.post("/login", userController.signIn);

router.post("/signUp", userController.signUp);

/* Change user's information. */
router.put("/", isAuthenticate, userController.editUser);

module.exports = router;
