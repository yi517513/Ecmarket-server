const { HttpErrors } = require("./httpErrors");

function setupErrorHandler(app) {
  // 集中錯誤處理
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const isDevError =
      err instanceof HttpErrors.InternalServer ||
      err instanceof TypeError ||
      err instanceof ReferenceError;
    console.log(err);
    if (isDevError) {
      console.log("is devError:");
      console.error(err);
    } else {
      console.error(err);
    }

    res
      .status(statusCode)
      .json(
        isDevError
          ? "伺服器發生內部錯誤，請稍後再試"
          : err.message || "Internal Server Error"
      );
  });
}

module.exports = setupErrorHandler;
