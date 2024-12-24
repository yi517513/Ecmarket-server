class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 403;
  }
}

module.exports = {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
};

// 明白了，也就是extend讓子類連接父類的原型鏈，super讓this在子類確認綁定，然後當運用到任何的方法都是透過原型鏈往上找，最優先的則是實例層也就是子類，找不到就往父類直到null，而剛剛提到的父類 A方法調用了 this.B 這時候就會是實例層成功運行A因為在這邊有定義，而執行父類的A原因是因為有superA這時候就會執行父類A又因為這邊執行了this.B所以一樣從原型鏈開始找B一樣也是實例層優先，若找不到就往上，所以子類沒定義就會是執行父類B了。總結就是從原型鏈找起，以上總結正確嗎? 另外的疑問是
