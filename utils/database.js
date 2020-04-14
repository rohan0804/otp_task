const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("otpverificatiion", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
