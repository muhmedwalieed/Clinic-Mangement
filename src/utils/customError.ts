export default class CustomError extends Error {
    statusCode: number;
    status: string;
    errors: object;
    constructor(message: string, statusCode: number, errors = {}) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
