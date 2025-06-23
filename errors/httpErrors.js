class BaseHttpError extends Error {
  constructor(name, message, statusCode) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

const HttpErrors = {
  BadRequest: class extends BaseHttpError {
    constructor(message = "Bad Request") {
      super("BadRequestError", message, 400);
    }
  },
  Unauthorized: class extends BaseHttpError {
    constructor(message = "Unauthorized") {
      super("UnauthorizedError", message, 401);
    }
  },
  Forbidden: class extends BaseHttpError {
    constructor(message = "Forbidden") {
      super("ForbiddenError", message, 403);
    }
  },
  NotFound: class extends BaseHttpError {
    constructor(message = "Not Found") {
      super("NotFoundError", message, 404);
    }
  },
  Conflict: class extends BaseHttpError {
    constructor(message = "Conflict") {
      super("ConflictError", message, 409);
    }
  },
  Unprocessable: class extends BaseHttpError {
    constructor(message = "Unprocessable Entity") {
      super("UnprocessableError", message, 422);
    }
  },
  InternalServer: class extends BaseHttpError {
    constructor(message = "Internal Server Error") {
      super("InternalServerError", message, 500);
    }
  },
};

module.exports = { HttpErrors };
