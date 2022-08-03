require("dotenv").config();

module.exports = {
  development: {
    username: "hung",
    password: "password",
    database: "dev_db",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: "hung",
    password: "password",
    database: "test_db",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: "hung",
    password: "password",
    database: "production_db",
    host: "127.0.0.1",
    dialect: "postgres",
  },
};
