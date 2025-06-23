const { HttpErrors } = require("../errors/httpErrors");

class EmailService {
  constructor(sendEmail) {
    this.sendEmail = sendEmail;
  }

  async sendToEmail({ email, content }) {
    try {
      await this.sendEmail(email, "您的驗證碼是：", content);
    } catch (err) {
      console.error("Email 發送失敗:", err);
      throw new HttpErrors.InternalServer("無法發送驗證碼，請稍後再試");
    }
  }
}
module.exports = { EmailService };
