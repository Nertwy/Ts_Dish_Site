class ApiErrors extends Error {
  status: number;
  errors: Error[];
  constructor(status: number, message: string, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
  static UnauthorizedError() {
    return new ApiErrors(401, "User not authorized!");
  }
  static BadRequest(message: string, errors = []) {
    return new ApiErrors(400, message, errors);
  }
  static AlreadyExists(message: string, errors = []) {
    return new ApiErrors(409, message, errors);
  }
  static TokenExpired() {
    return new ApiErrors(401, "User Token Expired")
  }
}
export default ApiErrors;
