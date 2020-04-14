const express = require("express");
const sequelize = require("./utils/database");
const bodyparser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const userRouter = require("./routes/user");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(expressLayouts);
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static("views"));
app.use(express.json());
app.use("/", userRouter);
sequelize
  .sync()
  .then((result) => {
    // console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(2100, () => {
  console.log("node server is starting at port 2100");
});
