class BaseHttpError extends Error {
  constructor(name, message, statusCode, code) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.code = code; // error code 給前端判斷用
  }
}

const HttpErrors = {
  BadRequest: (message = "Bad Request", code = "BAD_REQUEST") =>
    new BaseHttpError("BadRequestError", message, 400, code),

  Unauthorized: (message = "Unauthorized", code = "UNAUTHORIZED") =>
    new BaseHttpError("UnauthorizedError", message, 401, code),

  Forbidden: (message = "Forbidden", code = "FORBIDDEN") =>
    new BaseHttpError("ForbiddenError", message, 403, code),

  NotFound: (message = "Not Found", code = "NOT_FOUND") =>
    new BaseHttpError("NotFoundError", message, 404, code),

  Conflict: (message = "Conflict", code = "CONFLICT") =>
    new BaseHttpError("ConflictError", message, 409, code),

  Unprocessable: (message = "Unprocessable Entity", code = "UNPROCESSABLE") =>
    new BaseHttpError("UnprocessableError", message, 422, code),

  InternalServer: (message = "Internal Server Error", code = "INTERNAL") =>
    new BaseHttpError("InternalServerError", message, 500, code),
};

module.exports = { HttpErrors };
