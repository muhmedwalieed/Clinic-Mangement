import { USER_ROLES } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/customError";

const roleHierarchy: Record<string, number> = {
    [USER_ROLES.OWNER]: 3,
    [USER_ROLES.ADMIN]: 2,
    [USER_ROLES.DOCTOR]: 1,
    [USER_ROLES.NURSE]: 0,
};

export const checkCreateUserPermission = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const role = (req as any).userRole;
    const { role: userRole } = req.body;
    if (role === USER_ROLES.OWNER) {
        return next();
    }

    if (role === USER_ROLES.ADMIN) {
        const allowedRoles = [USER_ROLES.DOCTOR, USER_ROLES.NURSE];
        if (!allowedRoles.includes(userRole.toUpperCase())) {
            const e = new CustomError(
                "You do not have permission to create this type of user.",
                403
            );
            next(e);
            return;
        }
        next();
        return;
    }

    const e = new CustomError(
        "You do not have permission to create users.",
        403
    );
    next(e);
    return;
};
