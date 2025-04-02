import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import CustomError from "../utils/customError";

export const validatorInput = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let message: Record<string, string> = {};
        const err = errors.array();
        err.forEach((e) => {
            if ("path" in e) {
                message[e.path] = e.msg;
            }
        });
        const e = new CustomError("Invalid data in the input field", 400,message);
        next(e);
        return;
    } else {
        next();
    }
};
