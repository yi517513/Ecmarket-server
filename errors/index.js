const { InternalServerError } = require("./httpErrors");

function setupErrorHandler(app) {
  // 集中錯誤處理
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const isDevError =
      err instanceof InternalServerError ||
      err instanceof TypeError ||
      err instanceof ReferenceError;

    if (isDevError) {
      console.log("is devError:");
      console.error(err);
    } else {
      console.error(err);
    }

    res.status(statusCode).send({
      message: isDevError
        ? "伺服器發生內部錯誤，請稍後再試"
        : err.message || "Internal Server Error",
      data: null,
    });
  });
}

module.exports = setupErrorHandler;
