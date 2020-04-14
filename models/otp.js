const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const otp = sequelize.define("otp", {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  otp: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      len: 5,
    },
  },
  count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    min: 0,
    max: 1,
  },
  isverified: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  blockdate: {
    type: "TIMESTAMP",
    allowNull: true,
  },
});
module.exports = otp;
