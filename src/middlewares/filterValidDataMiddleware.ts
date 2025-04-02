import { NextFunction, Request, Response } from "express";
export const filterValidData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { validData } = req.body;
    req.body = validData;
    next();
};
