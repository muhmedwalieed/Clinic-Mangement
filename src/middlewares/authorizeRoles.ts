import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/customError";

export const authorizeRoles = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userRole = req.user?.userRole.toUpperCase();
            const hasPermission = allowedRoles.some(
                (role) => role.toUpperCase() === userRole
            );

            if (!hasPermission) {
                const message =
                    "You do not have permission to access this resource.";
                const e = new CustomError(message, 403);
                next(e);
                return;
            }
            next();
        } catch (error) {
            console.error((error as any).message);
            const e = new CustomError("Authorization failed.", 500);
            next(e);
        }
    };
};
