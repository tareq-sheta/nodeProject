export class CustomError extends Error {
  constructor(message, status, location = "") {
    super(message);
    this.status = status;
    this.location = location;
    // this.name = this.constructor.name;
    // Error.captureStackTrace(this, this.constructor);
  }
}
