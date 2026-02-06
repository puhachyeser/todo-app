class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg) {
    return new ApiError(400, msg);
  }

  static unauthorized(msg = "Not authorized") {
    return new ApiError(401, msg);
  }

  static notFound(msg = "Resource not found") {
    return new ApiError(404, msg);
  }

  static internal(msg = "Internal server error") {
    return new ApiError(500, msg);
  }
}

module.exports = ApiError;