const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendCodeToEmail = async (email, verificationCode) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "驗證碼",
    text: `Your verification code is ${verificationCode}`,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendCodeToEmail };
