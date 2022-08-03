var jwt = require("jsonwebtoken");
const logger = require("./logger");

const signToken = (email) => {
  var token = jwt.sign({ email }, process.env.JWT_SECRET_KEY);
  return token;
};

const isAuthenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.slice(7);
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      res.locals.email = decodedToken.email;
      next();
    } catch (err) {
      logger.error(err);
      return res.status(401).send({ message: "Invalid token" });
    }
  } else return res.status(401).send({ message: "Token is missing" });
};

module.exports = { signToken, isAuthenticate };
