module.exports = function (email, otp) {
  let mailOptions = {};
  (mailOptions.from = "rohanshrivastav1999@gmail.com"),
    (mailOptions.to = email),
    (mailOptions.subject = `REGISTERATION OTP`),
    (mailOptions.html = `
                        <p>Dear,<p>
                        <p>Your otp for rigisteration is</p>
                        <p>${otp}</p>
  
                        <p>regards</p>`);
  return mailOptions;
};
