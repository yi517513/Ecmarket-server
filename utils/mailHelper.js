const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendVerificationCode = (email, verificationCode, callback) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Verification Code",
    text: `Your verification code is ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      callback(error, null); // 發送失敗，返回錯誤
    } else {
      callback(null, info); // 發送成功，返回信息
    }
  });
};

module.exports = { sendVerificationCode };
