import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/customError";

export const globalErrorHandel = (
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        errors: error.errors,
    });
};
