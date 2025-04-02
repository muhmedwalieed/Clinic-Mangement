import { NextFunction, Request, Response } from "express";
const filterValidData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { validData } = req.body;
    req.body = validData;
    next();
};

const filterValidQuery = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { validQuery } = req.query;
    (req as any).query = validQuery;
    next();
};
export { filterValidData, filterValidQuery };
