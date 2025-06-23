function setupErrorHandler(app) {
  // 集中錯誤處理
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const isDevError =
      statusCode === 500 ||
      err instanceof TypeError ||
      err instanceof ReferenceError;

    if (isDevError) {
      console.error("--------------------------");
      console.error("is devError:", err);
      console.error("--------------------------");
    } else {
      console.error(err);
    }

    res.status(statusCode).json(
      isDevError
        ? {
            message: "伺服器發生內部錯誤，請稍後再試",
            code: "INTERNAL",
          }
        : {
            message: err.message || "Internal Server Error",
            code: err.code || "INTERNAL",
          }
    );
  });
}

module.exports = setupErrorHandler;
