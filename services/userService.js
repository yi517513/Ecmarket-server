const userRepository = require("../repository/userRepository");
const { InternalServerError } = require("../errors/httpErrors");

class UserService {
  constructor(userRepository) {
    this.repo = userRepository;
  }

  async updateUserWallet({ payment, session }) {
    const { amount, payee } = payment;
    if (!amount) throw new InternalServerError("缺少金額資訊");
    if (!payee) throw new InternalServerError("缺少用戶 ID");
    if (!session) throw new InternalServerError("缺少sesion參數");

    const updatedWallet = await this.userRepo.updateWallet({
      amount,
      userId,
      session,
    });

    if (!updatedWallet)
      throw new InternalServerError(`更新錢包失敗，用戶ID:${userId}`);
  }
}

const userService = new UserService(userRepository); // 確保只有一個實例
module.exports = userService;
