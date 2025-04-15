import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomError from "./customError";
import { Iuser } from "../types/express";

export const createJWT = (user: Iuser) => {
    const token = jwt.sign(
        { id: user.id, username: user.username, userRole: user.userRole, isActive: user.profileCompleted },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    );
    return token;
};

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    const e = new CustomError("Please log in to access this resource.", 401);
    if (!bearer) {
        return next(e);
    }
    const token = bearer.split(" ")[1];
    if (!token) {
        return next(e);
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as Iuser;
        req.user = payload;
        next();
    } catch (error) {
        const e = new CustomError("Expired token. Please log in again to continue.", 401);
        next(e);
    }
};
