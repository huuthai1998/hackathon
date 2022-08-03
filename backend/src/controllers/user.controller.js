const bcrypt = require("bcrypt");
var logger = require("../utils/logger");
var db = require("../../database/models");
const { signToken } = require("../utils/jwt");
const {
  getUserByEmail,
  createUser,
  updateUser,
} = require("../services/user.service");
const saltRounds = parseInt(process.env.SALT_ROUNDS);

exports.signIn = async (req, res, next) => {
  try {
    logger.info("Executing Sign in controller");
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).send({ message: "User does not exist" });
    logger.info("Validating password");
    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (!passwordIsMatch) throw new Error("Password is incorrect");
    logger.info("Signing token");
    const token = signToken(email, saltRounds);
    res.status(200).send({ token });
  } catch (err) {
    logger.error(err);
    res.status(401).send({ message: err.message });
  }
};

exports.signUp = async (req, res, next) => {
  try {
    logger.info("Executing Sign up controller");
    const { email, password, role } = req.body;
    const user = await getUserByEmail(email);
    if (user) {
      logger.info("This email has already been taken");
      res.status(409).send({ message: "This email has already been taken" });
    } else {
      logger.info("Hashing password");
      const hashPassword = await bcrypt.hash(password, saltRounds);
      await createUser({
        email,
        role,
        password: hashPassword,
      });
      logger.info("Signing token");
      const token = signToken(email);
      res.status(200).send({ token });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: err.message });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    logger.info("Executing Get user controller");
    const { email: payloadEmail } = res.locals;
    const user = await getUserByEmail(payloadEmail);
    if (!user) return res.status(401).send({ message: "User does not exist" });
    const { username, email, avatar } = user;
    res.status(200).send({ user: { username, email, avatar } });
  } catch (err) {
    logger.error(err);
    res.status(401).send({ message: err.message });
  }
};

exports.editUser = async (req, res, next) => {
  try {
    logger.info("Executing Edit user controller");
    const { username, avatar, newPassword, oldPassword } = req.body;
    const { email } = res.locals;
    let user = await getUserByEmail(email);
    if (!user) return res.status(401).send({ message: "User does not exist" });

    if (newPassword) {
      logger.info("Validating password");
      const passwordIsMatch = await bcrypt.compare(oldPassword, user.password);
      if (!passwordIsMatch) {
        logger.info("Password is incorrect");
        return res.status(403).send({ message: "Password is incorrect" });
      }
      logger.info("Hashing password");
      const hashPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashPassword;
    }

    await updateUser(user, username, avatar);
    res.status(200).send({
      user: {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: err.message });
  }
};
