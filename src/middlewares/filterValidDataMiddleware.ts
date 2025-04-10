import { NextFunction, Request, Response } from "express";

const initValidData = (req: Request, res: Response, next: NextFunction) => {
    req.body ? req.body : {};
    req.body.validData = {};
    next();
};

const filterValidData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { validData } = req.body;
    req.body = validData;
    next();
};

export { filterValidData, initValidData };
