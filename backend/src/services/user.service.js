var db = require("../../database/models");
var logger = require("../utils/logger");
const User = db.user;

exports.getUserByEmail = async (email) => {
  try {
    logger.info(`Checking if user with email ${email} exists`);
    const user = await User.findByPk(email);
    if (!user) {
      logger.error(`User with email ${email} does not exist`);
      return false;
    }
    logger.info(`Found user with email ${email}`);
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

exports.createUser = async (user) => {
  logger.info("Creating user");
  await User.create(user);
};

exports.updateUser = async (user, username, avatar) => {
  logger.info("Updating user");
  user.username = username || user.username;
  user.avatar = avatar || user.avatar;
  await user.save();
};
