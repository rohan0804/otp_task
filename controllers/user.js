const Otp = require("../models/otp");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");

exports.defaultroute = (req, res) => {
  res.render("homepage");
};

exports.getotp = async (req, res) => {
  const { email } = req.body;
  let otp = Math.floor(Math.random() * 90000) + 10000;
  try {
    const checkemail = await Otp.findAll({
      where: {
        email: email,
      },
    });
    if (checkemail.length > 0) {
      let today = new Date();
      let dbdate = checkemail[0].dataValues.blockdate;
      let date = today.getDate();
      if (dbdate.getDate() > date) {
        return res
          .status(400)
          .send(
            `<h1>Sorry You Are Blocked <i class="material-icons" style="font-size:40px;">block</i> For Next 24 Hour!</h1>`
          );
      }
      console.log("email already registered");
      if (checkemail[0].dataValues.isverified == true) {
        return res
          .status(400)
          .send(
            `<h1>Already Verified <i class="material-icons" style="font-size:40px;">check</i></h1>`
          );
      }
      return res
        .status(400)
        .send(
          `<h1>Email <i class="material-icons" style="font-size:40px;">email</i></h1> Already Registered<i class="material-icons" style="font-size:30px;">warning</i></h1>`
        );
    }
    const newrecord = await Otp.create({
      email: email,
      otp: otp,
    });
    const data = newrecord.dataValues;
    if (newrecord) {
      const { id, email, otp } = data;
      console.log(otp);
      let getmailoptions = require("../mail/mailoptions");
      let mailOptions = getmailoptions(email, otp);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
          user: "rohanshrivastav1999@gmail.com",
          pass: "rohan0804",
        },
      });
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(400).json({
            status: false,
            statusCode: res.statusCode,
            message: "could not send email",
            error,
          });
        } else {
          console.log(info.response);
          console.log("mail send successfullly");
        }
      });
      res.render("verify", {
        id,
        email,
        otp,
      });
    } else {
      res.status(400).send({
        messsage: "error in creatig new record",
      });
    }
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
};
exports.updateisverified = async (req, res) => {
  const result = await Otp.update(
    { isverified: true },
    { where: { id: req.body.id } }
  );
  const record = await Otp.findByPk(req.body.id);
  const otp = record.dataValues.otp;
  res.send({
    status: "success",
    otp: otp,
  });
};
exports.resendotp = async (req, res) => {
  const email = req.body.email;
  const record = await Otp.findByPk(req.body.id);
  const prev_count = record.dataValues.count;
  if (prev_count == 1) {
    let today = new Date();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let calcultenextdate = parseInt(today.getDate()) + 1;
    calcultenextdate = calcultenextdate.toString();
    let blockdate =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      calcultenextdate;
    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + " " + time;
    console.log(dateTime);
    let blockdatetime = blockdate + " " + time;
    console.log(blockdatetime);
    const result = await Otp.update(
      { blockdate: blockdatetime },
      { where: { email: email } }
    );
    return res.send({
      message: `Sorry You Are Blocked For Next 24 Hour<i class="material-icons" style="font-size:30px;">block</i>`,
      status: false,
    });
  }
  let otp = Math.floor(Math.random() * 90000) + 10000;
  console.log("updated otp", otp);
  let getmailoptions = require("../mail/mailoptions");
  let mailOptions = getmailoptions(email, otp);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: "rohanshrivastav1999@gmail.com",
      pass: "rohan0804",
    },
  });
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(400).json({
        status: false,
        statusCode: res.statusCode,
        message: "could not send email",
        error,
      });
    } else {
      console.log(info.response);
      console.log("mail send successfully");
    }
  });

  console.log(prev_count);
  const result = await Otp.update(
    {
      count: prev_count + 1,
      otp: otp,
    },
    { where: { id: req.body.id } }
  );
  console.log(result);
  res.send({
    otp,
    status: true,
  });
};
