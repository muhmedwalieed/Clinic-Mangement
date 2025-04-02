import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomError from "./customError";

export const createJWT = (user: { id: string; username: string;userRole:string }) => {
    const token = jwt.sign(
        { id: user.id, username: user.username ,userRole:user.userRole},
        process.env.JWT_SECRET || ""
    );
    return token;
};

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        const e = new CustomError(
            "Please log in to access this resource.",
            401
        );
        next(e);
        return;
    }
    const token = bearer.split(" ")[1];
    if (!token) {
        const e = new CustomError(
            "Please log in to access this resource.",
            401
        );
        next(e);
        return;
    }

    try {
        const pyload = jwt.verify(token, process.env.JWT_SECRET || "test");
        (req as any).user = pyload;
        next();
    } catch (error) {
        const e = new CustomError(
            "Invalid or expired token. Please log in again to continue.",
            401
        );
        next(e);
    }
};
