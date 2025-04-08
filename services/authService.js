const authRepository = require("../repository/authRepository");
const { generateToken } = require("../helpers/tokenHelper");
const { createCookie } = require("../helpers/cookieHelper");
const {
  InternalServerError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../errors/httpErrors");
const bcrypt = require("bcrypt");
const { generateCode } = require("../helpers/securityHelper");
const emailEvents = require("../eventBus/emitters/emailEvents");
const sessionEvents = require("../eventBus/emitters/sessionEvents");
const registerEvents = require("../eventBus/emitters/registerEvents");
const userIdEvents = require("../eventBus/emitters/userIdEvents");

class AuthService {
  constructor(authRepository) {
    this.authRepo = authRepository;
  }

  async login({ email, password }) {
    if (!email) throw new InternalServerError("缺少信箱");
    if (!password) throw new InternalServerError("缺少密碼");

    const foundUser = await this.authRepo.findByEmail(email);
    if (!foundUser) throw new UnauthorizedError("信箱或密碼錯誤");

    // 驗證密碼
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) throw new UnauthorizedError("信箱或密碼錯誤");

    // 更新登入時間
    const { userId } = foundUser;
    const updateUser = await this.authRepo.updateLoginTime(userId);
    if (!updateUser) throw new InternalServerError("找不到更新對象");

    const { cookie, jti } = await createCookie(); // httpOnly , 10m

    // 儲存用戶資訊到 redis
    sessionEvents.emitSetUser({ jti, user: updateUser });

    return { user: updateUser, cookie };
  }

  async register({ username, email, password, verificationCode }) {
    if (!username || !email || !password || !verificationCode)
      throw new InternalServerError("缺少必要資訊");

    const existingUser = await this.authRepo.exists({ email });
    if (existingUser) throw new ConflictError("此信箱已經被註冊過");

    const tempEmail = await registerEvents.emitGetTempEmail(verificationCode);
    if (!tempEmail) throw new NotFoundError("驗證碼過期或錯誤");

    const [hashedPassword, userId] = await Promise.all([
      bcrypt.hash(password, 10),
      userIdEvents.emitGenerateUserId(),
    ]);

    await this.authRepo.create({
      userId,
      username,
      email,
      password: hashedPassword,
    });
  }

  async sendCode({ email }) {
    if (!email) throw new InternalServerError("缺少信箱");
    const existingUser = await this.authRepo.exists({ email });

    if (existingUser) throw new ConflictError("此信箱已經被註冊過");

    const verificationCode = generateCode();

    registerEvents.emitSetTempEmail({ email, verificationCode });
    emailEvents.emitSendCode({ email, content: verificationCode });
  }

  async logout({ currentUserId }) {
    if (!currentUserId) throw new InternalServerError("缺少使用者 ID");

    await this.authRepo.updateLogoutTime(currentUserId);
  }

  async refreshToken(currentUser = null) {
    const { userId, username, lastLogoutTime, lastLoginTime } =
      currentUser || {};
    if (!userId || !username || !lastLogoutTime || !lastLoginTime) {
      throw new InternalServerError("缺少使用者資訊");
    }

    const accessToken = await generateToken("accessToken", currentUser, "10m");

    const accessCookie = createCookie(
      "accessToken",
      accessToken,
      10 * 60 * 1000
    ); // 10m

    return accessCookie;
  }
}

const authService = new AuthService(authRepository);
module.exports = authService;
